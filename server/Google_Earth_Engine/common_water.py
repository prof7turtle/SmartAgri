import ee
import time
import os
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as mdates

try:
    ee.Initialize(project='climate-resilient-agriculture')
    print("Google Earth Engine initialized successfully.")
except ee.EEException as e:
    print(f"Error initializing Earth Engine: {e}")
    print("Please make sure you have authenticated via 'earthengine authenticate'.")
    exit()

GCS_BUCKET_NAME = 'earth-engine-climate-data'


aoi = ee.Geometry.Rectangle([73.70, 18.65, 73.71, 18.66])

s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
    .filterBounds(aoi) \
    .filterDate('2025-01-01', '2025-04-01') \
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))

parameters=["ndwi","ndmi","lswi","awei","mndwi","sarwi","ewi"]

def getNDWI(image):
    green = image.select('B3')
    nir = image.select('B8')
    ndwi = green.subtract(nir).divide(green.add(nir)).rename('ndwi')
    return ndwi.copyProperties(image, ['system:time_start'])

def getNDMI(image):
    nir = image.select('B8')
    swir = image.select('B11')
    ndmi = nir.subtract(swir).divide(nir.add(swir)).rename('ndmi')
    return ndmi.copyProperties(image, ['system:time_start'])

def getLSWI(image):
    nir = image.select('B8')
    swir = image.select('B12')

    lswi = nir.subtract(swir).divide(nir.add(swir)).rename('lswi')
    return lswi.copyProperties(image, ['system:time_start'])

def getAWEIsh(image):
    awei = image.expression(
        '4 * (GREEN - SWIR1) - (0.25 * NIR + 2.75 * SWIR2)', {
            'GREEN': image.select('B3'),
            'SWIR1': image.select('B11'),
            'NIR': image.select('B8'),
            'SWIR2': image.select('B12')
        }).rename('awei')
    return awei.copyProperties(image, ['system:time_start'])

def getMNDWI(image):
    mndwi = image.normalizedDifference(['B3', 'B11']).rename('mndwi')
    return mndwi.copyProperties(image, ['system:time_start'])

def getSARWI(image):
    sarwi = image.normalizedDifference(['B3', 'B8A']).rename('sarwi')
    return sarwi.copyProperties(image, ['system:time_start'])

def getWI2015(image):
    wi2015 = image.normalizedDifference(['B3', 'B5']).rename('ewi')
    return wi2015.copyProperties(image, ['system:time_start'])

def create_feature_factory(index_name):
    def create_feature(img):
        mean_dict = img.reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=aoi,
            scale=10,
            maxPixels=1e9
        )

        centroid = aoi.centroid().coordinates()
        lon = ee.Number(centroid.get(0))
        lat = ee.Number(centroid.get(1))

        index_value = ee.Number(mean_dict.get(index_name))

        return ee.Feature(None, {
            'date': img.date().format('YYYY-MM-dd'),
            index_name : index_value,
            'longitude': lon,
            'latitude': lat
        })
    return create_feature

series=None
for index in parameters:
    if(index=="ndwi"):
        series=s2.map(getNDWI)
    if(index=="ndmi"):
        series=s2.map(getNDMI)
    if(index=="lswi"):
        series=s2.map(getLSWI)
    if(index=="awei"):
        series=s2.map(getAWEIsh)
    if(index=="mndwi"):
        series=s2.map(getMNDWI)
    if(index=="sarwi"):
        series=s2.map(getSARWI)
    if(index=="ewi"):
        series=s2.map(getWI2015)
    

    if(series is None):
        print("Series not found")
        break

    feature_collection = ee.FeatureCollection(series.map(create_feature_factory(index)))

    GCS_FILE_NAME = index
    file_path = f'water/{GCS_FILE_NAME}-00000-of-00001.csv' 

    print(f"\nStarting export to Google Cloud Storage bucket: '{GCS_BUCKET_NAME}'...")
    task_gcs = ee.batch.Export.table.toCloudStorage(
        collection=feature_collection,
        description='Export_Index_to_GCS',
        bucket=GCS_BUCKET_NAME,
        fileNamePrefix=f"water/{GCS_FILE_NAME}",
        fileFormat='CSV'
    )
    task_gcs.start()

    while task_gcs.active():
        print(f"Polling for task status... (Current status: {task_gcs.status()['state']})")
        time.sleep(2)

    status = task_gcs.status()
    if status['state'] == 'COMPLETED':
        print("Export task completed successfully!")
        print(f"File saved in GCS Bucket '{GCS_BUCKET_NAME}' with prefix '{GCS_FILE_NAME}'.")
        
        # time.sleep(10)
        try:
            from google.cloud import storage
            storage_client = storage.Client()
            bucket = storage_client.bucket(GCS_BUCKET_NAME)

            blobs = list(bucket.list_blobs(prefix=f"water/{GCS_FILE_NAME}"))
            if not blobs:
                print(f"❌ No files found in bucket with prefix: water/{GCS_FILE_NAME}")
                # exit()

            for blob in blobs:
                if blob.name.endswith(".csv"):
                    # destination_file_name = f"{os.path.basename(blob.name)}"
                    filename = os.path.basename(blob.name)
                    destination_file_name = os.path.join(r"I:\Projects\Climate-Resilient-Agriculture\System\server",filename)
                    blob.download_to_filename(destination_file_name)
                    print(f"✅ File downloaded to: {os.path.abspath(destination_file_name)}")
                    file_path = destination_file_name
                    break
            else:
                print("❌ No CSV file found in the exported blobs.")

        except ImportError:
            print("\nTo automatically download the file, please install the GCS client library:")
            print("pip install google-cloud-storage")
        except Exception as e:
            print(f"\nAn error occurred during download: {e}")

    else:
        print(f"Export task failed or was cancelled. Final status: {status['state']}")
        print(f"Error message: {status.get('error_message', 'No error message provided.')}")
        # exit() # Exit the script if the export failed/
        break


