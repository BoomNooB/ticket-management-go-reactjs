// Home.jsx

import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CreateTicket from "./CreateTicket";
import EditTicket from "./EditTicket";

const MySwal = withReactContent(Swal);

const Home = () => {
	const [tickets, setTickets] = useState([]);
	const [creatingTicket, setCreatingTicket] = useState(false);
	const [editingTicket, setEditingTicket] = useState(false);

	useEffect(() => {
		fetchTickets();
	}, []);

	const fetchTickets = async () => {
		try {
			const response = await axios.get("/tickets");
			const data = response.data;

			const formattedData = data.map((ticket) => ({
				...ticket,
				createdAt: new Date(ticket.createdAt).toLocaleString(),
				updatedAt: new Date(ticket.updatedAt).toLocaleString(),
			}));

			setTickets(formattedData);
		} catch (error) {
			console.error("Failed to fetch tickets:", error);
		}
	};

	const handleTicketCreated = () => {
		// Display success message using SweetAlert
		MySwal.fire({
			title: "Success",
			text: "Ticket created successfully",
			icon: "success",
			showCancelButton: false,
			confirmButtonText: "OK",
		}).then(() => {
			// Reset the creatingTicket state to close the create modal
			setCreatingTicket(false);
			// Fetch the updated list of tickets
			fetchTickets();
		});
	};

	const handleEditTicket = (ticket) => {
		setEditingTicket(ticket);
	};

	const handleTicketUpdated = () => {
		// Display success message using SweetAlert
		MySwal.fire({
			title: "Success",
			text: "Ticket updated successfully",
			icon: "success",
			showCancelButton: false,
			confirmButtonText: "OK",
		}).then(() => {
			// Reset the editingTicket state to close the edit modal
			setEditingTicket(false);
			// Fetch the updated list of tickets
			fetchTickets();
		});
	};

	return (
		<div>
			<h1 className="text-center">Ticket Management System</h1>

			<button
				className="btn btn-primary"
				onClick={() => setCreatingTicket(true)}
			>
				New Ticket
			</button>

			<table className="table table-striped">
				<thead>
					<tr>
						<th>Title</th>
						<th>Description</th>
						<th>Contact</th>
						<th>Status</th>
						<th>Created</th>
						<th>Updated</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{tickets.map((ticket) => (
						<tr key={ticket.id}>
							<td>{ticket.title}</td>
							<td>{ticket.description}</td>
							<td>{ticket.contactInfo}</td>
							<td>{ticket.status}</td>
							<td>{ticket.createdAt}</td>
							<td>{ticket.updatedAt}</td>
							<td>
								<button
									className="btn btn-primary"
									onClick={() => handleEditTicket(ticket)}
								>
									Edit
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{editingTicket && (
				<div className="modal fade show" style={{ display: "block" }}>
					<div className="modal-dialog modal-dialog-centered">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Edit Ticket</h5>
								<button
									type="button"
									className="btn-close"
									onClick={() => setEditingTicket(false)}
								></button>
							</div>
							<div className="modal-body">
								<EditTicket
									ticket={editingTicket}
									onTicketUpdated={handleTicketUpdated}
								/>
							</div>
						</div>
					</div>
				</div>
			)}

			{creatingTicket && (
				<div className="modal fade show" style={{ display: "block" }}>
					<div className="modal-dialog modal-dialog-centered">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Create Ticket</h5>
								<button
									type="button"
									className="btn-close"
									onClick={() => setCreatingTicket(false)}
								></button>
							</div>
							<div className="modal-body">
								<CreateTicket onTicketCreated={handleTicketCreated} />
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Home;
