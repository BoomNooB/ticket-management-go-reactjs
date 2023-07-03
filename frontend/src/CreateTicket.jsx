import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const CreateTicket = () => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [contactInfo, setContactInfo] = useState("");
	const [isLoading, setIsLoading] = useState(false); // New loading state

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Prevent multiple submissions
		if (isLoading) {
			return;
		}

		setIsLoading(true);

		try {
			await axios.post("/ticket", {
				title,
				description,
				contactInfo,
				status: "Ticket Created",
			});

			MySwal.fire({
				title: "Success",
				text: "Ticket created successfully",
				icon: "success",
				showCancelButton: false,
				confirmButtonText: "OK",
			}).then((result) => {
				if (result.isConfirmed) {
					window.location.reload();
				}
			});

			setTitle("");
			setDescription("");
			setContactInfo("");
		} catch (error) {
			console.error("Failed to create ticket:", error);
			MySwal.fire({
				title: "Error",
				text: "Failed to create ticket",
				icon: "error",
				showCancelButton: false,
				confirmButtonText: "OK",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<div className="mb-3">
					<label htmlFor="title" className="form-label">
						Title
					</label>
					<input
						type="text"
						className="form-control"
						id="title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="description" className="form-label">
						Description
					</label>
					<input
						type="text"
						className="form-control"
						id="description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="contactInfo" className="form-label">
						Contact Info
					</label>
					<input
						type="text"
						className="form-control"
						id="contactInfo"
						value={contactInfo}
						onChange={(e) => setContactInfo(e.target.value)}
					/>
				</div>
				<button type="submit" className="btn btn-primary" disabled={isLoading}>
					{isLoading ? "Submitting..." : "Submit"}
				</button>
			</form>
		</div>
	);
};

export default CreateTicket;
