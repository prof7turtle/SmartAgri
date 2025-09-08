import ee
import time
import os
import pandas as pd
import matplotlib.pyplot as plt

# Initialize Earth Engine
try:
    ee.Initialize(opt_url='https://earthengine-highvolume.googleapis.com')
    print("Google Earth Engine initialized successfully.")
except ee.EEException as e:
    print(f"Error initializing Earth Engine: {e}")
    exit()

# Config
GCS_BUCKET_NAME = 'earth-engine-climate-data'
GCS_FILE_NAME = 'Farm_LAI_TimeSeries'
file_path = f'./{GCS_FILE_NAME}-00000-of-00001.csv' 

# Define AOI
aoi = ee.Geometry.Rectangle([73.70, 18.65, 73.71, 18.66])

# Sentinel-2 SR collection
s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
    .filterBounds(aoi) \
    .filterDate('2025-01-01', '2025-04-01') \
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))

# Define NDVI → LAI function
def compute_lai(image):
    nir = image.select('B8')
    red = image.select('B4')
    
    ndvi = nir.subtract(red).divide(nir.add(red)).rename('NDVI')
    
    # Estimate LAI from NDVI
    lai = ndvi.subtract(0.1).divide(0.4).rename('LAI')
    
    return lai.copyProperties(image, ['system:time_start'])

# Map LAI over image collection
lai_series = s2.map(compute_lai)

# Convert to FeatureCollection of date + mean LAI
def create_lai_feature(img):
    mean_dict = img.reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=aoi,
        scale=10,
        maxPixels=1e9
    )
    lai_value = ee.Number(mean_dict.get('LAI'))
    return ee.Feature(None, {
        'date': img.date().format('YYYY-MM-dd'),
        'lai': lai_value
    })

feature_collection = ee.FeatureCollection(lai_series.map(create_lai_feature))

# Export to GCS
print(f"\nStarting export to GCS bucket: '{GCS_BUCKET_NAME}'...")
task_gcs = ee.batch.Export.table.toCloudStorage(
    collection=feature_collection,
    description='Export_LAI_to_GCS',
    bucket=GCS_BUCKET_NAME,
    fileNamePrefix=GCS_FILE_NAME,
    fileFormat='CSV'
)
task_gcs.start()

# Monitor task
print("Task started. Monitoring status...")
while task_gcs.active():
    print(f"Polling for task status... (Current: {task_gcs.status()['state']})")
    time.sleep(30)

status = task_gcs.status()
if status['state'] == 'COMPLETED':
    print("Export task completed successfully!")

    # Download from GCS
    try:
        from google.cloud import storage
        storage_client = storage.Client()
        bucket = storage_client.bucket(GCS_BUCKET_NAME)

        blobs = list(bucket.list_blobs(prefix=GCS_FILE_NAME))
        for blob in blobs:
            if blob.name.endswith(".csv"):
                destination_file_name = f"./{os.path.basename(blob.name)}"
                blob.download_to_filename(destination_file_name)
                print(f"✅ File downloaded to: {os.path.abspath(destination_file_name)}")
                file_path = destination_file_name
                break
        else:
            print("❌ No CSV file found.")
    except Exception as e:
        print(f"Error downloading file: {e}")
else:
    print(f"Task failed: {status['state']} - {status.get('error_message', '')}")
    exit()

# Plot LAI Time Series
try:
    df = pd.read_csv(file_path)
    df['date'] = pd.to_datetime(df['date'])
    df.dropna(subset=['lai'], inplace=True)
    df.sort_values('date', inplace=True)

    plt.style.use('seaborn-v0_8-whitegrid')
    fig, ax = plt.subplots(figsize=(14, 7))

    ax.plot(df['date'], df['lai'], marker='o', linestyle='-', color='darkgreen', label='Mean LAI')
    ax.set_title('Mean LAI Time Series (Jan 2025 - Apr 2025)', fontsize=16)
    ax.set_xlabel('Date', fontsize=12)
    ax.set_ylabel('LAI', fontsize=12)
    ax.legend()
    ax.grid(True)
    fig.autofmt_xdate()
    plt.show()

except Exception as e:
    print(f"Plotting failed: {e}")
