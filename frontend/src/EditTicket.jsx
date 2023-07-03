// EditTicket.jsx

import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const EditTicket = ({ ticket, onTicketUpdated }) => {
	const [title, setTitle] = useState(ticket.title);
	const [description, setDescription] = useState(ticket.description);
	const [contactInfo, setContactInfo] = useState(ticket.contactInfo);
	const [status, setStatus] = useState(ticket.status);

	const handleFormSubmit = async (e) => {
		e.preventDefault();

		try {
			const updatedTicket = {
				id: ticket.id,
				title,
				description,
				contactInfo,
				status,
				updatedAt: new Date().toISOString(),
			};

			await axios.put(`/ticket/${ticket.id}`, updatedTicket);
			// Display success message using SweetAlert
			onTicketUpdated();
		} catch (error) {
			console.error("Failed to update ticket:", error);
			// Display error message using SweetAlert
			MySwal.fire({
				title: "Error",
				text: "Failed to update ticket",
				icon: "error",
				showCancelButton: false,
				confirmButtonText: "OK",
			});
		}
	};

	return (
		<div>
			<form onSubmit={handleFormSubmit}>
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
				<div className="mb-3">
					<label htmlFor="status" className="form-label">
						Status
					</label>
					<select
						className="form-select"
						id="status"
						value={status}
						onChange={(e) => setStatus(e.target.value)}
					>
						<option value="Pending">Pending</option>
						<option value="Accepted">Accepted</option>
						<option value="Resolved">Resolved</option>
						<option value="Rejected">Rejected</option>
					</select>
				</div>
				<button type="submit" className="btn btn-primary">
					Update
				</button>
			</form>
		</div>
	);
};

export default EditTicket;
