import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from google.cloud import vision
import io

client = vision.ImageAnnotatorClient.from_service_account_file('linen-marking-452309-e9-26175acd071a.json')

WATCH_FOLDER = 'sort_detected_image'

class detected_image_handler(FileSystemEventHandler):
    def on_created(self, event):
        if event.is_directory:
            return
        
        file_path = event.src_path
        if file_path.lower().endswith(('.png', '.jpg', '.jpeg')):  # Process only images
            with io.open(file_path, 'rb') as image_file:
                content = image_file.read()
            image = vision.Image(content=content)
            response=client.text_detection(image=image)
            texts=response.text_annotations
            print(f'New License no. [{texts[0].description}]')
            # time.sleep(3)

    def on_modified(self, event):
        if event.is_directory:
            return
        
        file_path = event.src_path
        if file_path.lower().endswith(('.png', '.jpg', '.jpeg')):  # Process only images
            with io.open(file_path, 'rb') as image_file:
                content = image_file.read()
            image = vision.Image(content=content)
            response=client.text_detection(image=image)
            texts=response.text_annotations
            print(f'Modified License no. [{texts[0].description}]')
            # time.sleep(3)

def start_monitoring():
    
    event_handler = detected_image_handler()
    observer = Observer()
    observer.schedule(event_handler, WATCH_FOLDER, recursive=True)
    observer.start()
    print(f"Watching: {WATCH_FOLDER}")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    start_monitoring()
