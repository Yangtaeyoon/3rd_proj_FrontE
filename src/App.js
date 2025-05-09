import React, { useState } from "react";
import "./App.css";

function App() {
	const [video, setVideo] = useState(null);
	const [videoUploaded, setVideoUploaded] = useState(false);
	const [result, setResult] = useState(null);

	const handleUpload = async () => {
		const formData = new FormData();
		formData.append("video", video);

		const response = await fetch("http://localhost:5000/upload", {
			method: "POST",
			body: formData,
		});

		const data = await response.json();
		if (data.video_path) {
			setVideoUploaded(true);
			analyzeVideo(data.video_path);
		}
	};

	const analyzeVideo = async (videoPath) => {
		const response = await fetch("http://localhost:5000/analyze", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ video_path: videoPath }),
		});

		const data = await response.json();
		setResult(data);
	};

	return (
		<div className="container">
			<h1>AI 홈트 모니터링</h1>

			{!videoUploaded ? (
				<div className="upload-section">
					<input
						type="file"
						accept="video/*"
						onChange={(e) => setVideo(e.target.files[0])}
					/>
					<button onClick={handleUpload}>영상 업로드</button>
					<p>MP4, MOV, AVI 형식을 지원합니다. 최대 100MB</p>
				</div>
			) : (
				<div className="result-section">
					<h2>분석 결과</h2>
					{result && (
						<>
							<p>
								<strong>점수:</strong> {result.score}
							</p>
							<p>
								<strong>강점:</strong> {result.strengths.join(", ")}
							</p>
							<p>
								<strong>개선점:</strong> {result.improvements.join(", ")}
							</p>
						</>
					)}
				</div>
			)}
		</div>
	);
}

export default App;
