import numpy as np
import os
import cv2
import csv
import tkinter as tk
from tkinter import *
from tkinter import messagebox
from PIL import Image
from PIL import ImageTk
import face_recognition
from os import listdir
from os.path import isfile, join
from datetime import datetime
import serial

# Set up GUI
window = tk.Tk()  # Makes main window
window.wm_title("FaceIn - for Access Control")
window.config(background="#74b0c0")

font = cv2.FONT_HERSHEY_SIMPLEX
small_font = cv2.FONT_HERSHEY_COMPLEX_SMALL
known_face_encodings = []
known_face_names = []

face_names = []

registration = False

mypath = "./people"

for f in listdir(mypath):
    if isfile(join(mypath, f)):
        image = face_recognition.load_image_file(join(mypath, f))
        face_encoding = face_recognition.face_encodings(image)[0]
        known_face_encodings.append(face_encoding)
        known_face_names.append(f[:-4])

file_name = "./logs/accessLog"
if not os.path.exists(file_name):
    f = open(file_name, 'a+')
    f.close()

# Open serial connection with ESP32
ser = serial.Serial('/dev/ttyUSB0', 115200)  # Change '/dev/ttyUSB0' to the correct port

# Graphics window
imageFrame = tk.Frame(window, width=600, height=600, bg="white")
imageFrame.pack(pady=20)

# Capture video frames
cap = cv2.VideoCapture(0)

def close_window():
    window.quit()

def register(face_names):
    for name in face_names:
        if name != "Unknown":
            now = datetime.now()
            timestamp = str(now)[11:-7]
            with open(file_name, 'r') as file:
                lines = file.readlines()
                last_line = lines[-1] if lines else ""
                if not last_line.startswith(timestamp):
                    f = open(file_name, 'a+')
                    f.write(timestamp + "\t" + name + "\n")
                    f.close()

def is_face_recognized(face_names):
    return bool(face_names)

def send_access_signal():
    ser.write(b'1')

def show_frame():
    # Initialize some variables
    face_locations = []
    face_encodings = []
    process_this_frame = True
    global face_names
    face_names = []
    global registration
    _, frame = cap.read()
    small_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGBA)

    cv2.putText(frame, str(datetime.now().strftime("%H:%M %d/%m/%Y")), (20, 20), font, .5, (255, 0, 0), 2, cv2.LINE_AA)
    # Resize frame of video to 1/4 size for faster face recognition processing
    small_frame = cv2.resize(frame, (0, 0), fx=0.5, fy=0.5)
    # Only process every other frame of video to save time
    if process_this_frame:
        # Find all the faces and face encodings in the current frame of video
        face_locations = face_recognition.face_locations(small_frame)
        face_encodings = face_recognition.face_encodings(small_frame, face_locations)
        face_names = []
        for face_encoding in face_encodings:
            # See if the face is a match for the known face(s)
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            # If a match was found in known_face_encodings, just use the first one.
            if sum(matches) == 1 and True in matches:
                first_match_index = matches.index(True)
                name = known_face_names[first_match_index]
                face_names.append(name)
            elif sum(matches) > 1:
                # Or instead, use the known face with the smallest distance to the new face
                face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
                best_match_index = np.argmin(face_distances)
                if face_distances[best_match_index]:
                    name = known_face_names[best_match_index]
                face_names.append(name)

    process_this_frame = not process_this_frame

    # Display the results
    for (top, right, bottom, left), name in zip(face_locations, face_names):
        # Scale back up face locations since the frame we detected in was scaled to 1/2 size
        top *= 2
        right *= 2
        bottom *= 2
        left *= 2

        # Draw a box around the face
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

        # Draw a label with a name below the face
        cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
        cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

        # Check if face is recognized and display "Liberado" or "Acesso Negado"
        if is_face_recognized(face_names):
            cv2.putText(frame, "Liberado", (left, top - 10), font, 1.0, (0, 255, 0), 2)
            frame[top - 40:top - 10, left:right, :] = (0, 255, 0)
            # Send "Liberado" signal to ESP32
            send_access_signal()
            # Register the face in the access log
            register(face_names)
        else:
            cv2.putText(frame, "Acesso Negado", (left, top - 10), font, 1.0, (0, 0, 255), 2)
            frame[top - 40:top - 10, left:right, :] = (0, 0, 255)

    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGBA)
    img = Image.fromarray(frame)
    imgtk = ImageTk.PhotoImage(image=img)
    display1.imgtk = imgtk  # Shows frame for display 1
    display1.configure(image=imgtk)
    window.after(10, show_frame)

display1 = tk.Label(imageFrame)
display1.pack()

show_frame()  # Display
window.mainloop()  # Starts GUI

