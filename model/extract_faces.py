import cv2
import os
from mtcnn import MTCNN

IMG_SIZE = 128
FRAME_GAP = 5  # Extract more frames for better training data


def process_videos(input_dir, output_dir):
    """Extract faces from videos and save as images"""
    detector = MTCNN()
    os.makedirs(output_dir, exist_ok=True)

    for label in ["real", "fake"]:
        in_path = os.path.join(input_dir, label)
        out_path = os.path.join(output_dir, label)
        os.makedirs(out_path, exist_ok=True)

        if not os.path.exists(in_path):
            print(f"Warning: {in_path} does not exist, skipping...")
            continue

        videos = [
            v for v in os.listdir(in_path) if v.endswith((".mp4", ".avi", ".mov"))
        ]
        print(f"Processing {len(videos)} videos from {label}...")

        for video in videos:
            video_path = os.path.join(in_path, video)
            cap = cv2.VideoCapture(video_path)

            if not cap.isOpened():
                print(f"Error: Could not open {video_path}")
                continue

            count = 0
            saved = 0

            while True:
                ret, frame = cap.read()
                if not ret:
                    break

                if count % FRAME_GAP == 0:
                    try:
                        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                        faces = detector.detect_faces(rgb_frame)
                        if faces:
                            x, y, w, h = faces[0]["box"]
                            # Handle negative coordinates
                            x, y = max(0, x), max(0, y)
                            face = frame[y : y + h, x : x + w]
                            if face.size > 0:
                                face = cv2.resize(face, (IMG_SIZE, IMG_SIZE))
                                output_path = os.path.join(
                                    out_path, f"{video}_{saved}.jpg"
                                )
                                cv2.imwrite(output_path, face)
                                saved += 1
                    except Exception as e:
                        print(f"Error processing frame {count} of {video}: {e}")

                count += 1

            cap.release()
            print(f"  {video}: extracted {saved} faces from {count} frames")

    print("Face extraction complete!")


if __name__ == "__main__":
    process_videos("dataset", "frames")
