<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Activity Timer</title>
  <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
  <script src="https://cdn.rawgit.com/justadudewhohacks/face-api.js/master/dist/face-api.js"></script>
</head>
<body>

<h1>Activity Timer</h1>

<script>
  // Initialize face-api.js
  async function initializeFaceApi() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
  }

  // Start face detection
  async function startFaceDetection() {
    const video = document.createElement('video');
    document.body.append(video);

    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;

    video.addEventListener('playing', async () => {
      const canvas = faceapi.createCanvasFromMedia(video);
      document.body.append(canvas);
      const displaySize = { width: video.width, height: video.height };
      faceapi.matchDimensions(canvas, displaySize);

      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
      }, 1000); // Adjust the detection interval as needed
    });
  }

  // Start mouse activity tracking
  function startMouseActivityTracking() {
    let timer;
    
    function resetTimer() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        console.log('No activity detected for 10 minutes.');
        // Perform actions when no activity is detected
      }, 600000); // 10 minutes
    }

    document.addEventListener('mousemove', resetTimer);
    document.addEventListener('keydown', resetTimer);
  }

  // Initialize face-api.js and start detection and tracking
  async function initialize() {
    await initializeFaceApi();
    startFaceDetection();
    startMouseActivityTracking();
  }

  initialize();
</script>

</body>
</html>