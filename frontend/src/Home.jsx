import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CreateTicket from "./CreateTicket";
import EditTicket from "./EditTicket";

const MySwal = withReactContent(Swal);

const Home = () => {
	const [tickets, setTickets] = useState([]);
	const [creatingTicket, setCreatingTicket] = useState(false);
	const [editingTicket, setEditingTicket] = useState(false);
	const [sortConfig, setSortConfig] = useState(null);
	const [filteredStatus, setFilteredStatus] = useState([]);

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

	const requestSort = (key) => {
		let direction = "asc";
		if (
			sortConfig &&
			sortConfig.key === key &&
			sortConfig.direction === "asc"
		) {
			direction = "desc";
		}
		setSortConfig({ key, direction });
	};

	const sortTickets = (array, key, direction) => {
		const compareFn = (a, b) => {
			if (a[key] < b[key]) {
				return -1;
			}
			if (a[key] > b[key]) {
				return 1;
			}
			return 0;
		};

		const sortedArray = array.sort(compareFn);
		return direction === "desc" ? sortedArray.reverse() : sortedArray;
	};

	const sortedTickets = sortConfig
		? sortTickets(tickets, sortConfig.key, sortConfig.direction)
		: tickets;

	const handleFilterChange = (event) => {
		const value = event.target.value;
		if (filteredStatus.includes(value)) {
			setFilteredStatus(filteredStatus.filter((status) => status !== value));
		} else {
			setFilteredStatus([...filteredStatus, value]);
		}
	};

	const filterTickets = (array, status) => {
		if (status.length === 0) {
			return array;
		}
		return array.filter((ticket) => status.includes(ticket.status));
	};

	const filteredAndSortedTickets = filterTickets(sortedTickets, filteredStatus);

	const getSortIcon = (key) => {
		if (sortConfig && sortConfig.key === key) {
			return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
		}
		return <FaSort />;
	};

	return (
		<div className="container">
			<h1 className="text-center mt-4 mb-3">Ticket Management System</h1>

			<div className="text-end mb-3">
				<button
					className="btn btn-primary"
					onClick={() => setCreatingTicket(true)}
				>
					New Ticket
				</button>
			</div>

			<div className="filter-container mb-3">
				<label className="me-2">Filter by Status:</label>
				<div className="form-check form-check-inline">
					<input
						type="checkbox"
						className="form-check-input"
						value="Ticket Created"
						checked={filteredStatus.includes("Ticket Created")}
						onChange={handleFilterChange}
					/>
					<label className="form-check-label">Ticket Created</label>
				</div>
				<div className="form-check form-check-inline">
					<input
						type="checkbox"
						className="form-check-input"
						value="Pending"
						checked={filteredStatus.includes("Pending")}
						onChange={handleFilterChange}
					/>
					<label className="form-check-label">Pending</label>
				</div>
				<div className="form-check form-check-inline">
					<input
						type="checkbox"
						className="form-check-input"
						value="Accepted"
						checked={filteredStatus.includes("Accepted")}
						onChange={handleFilterChange}
					/>
					<label className="form-check-label">Accepted</label>
				</div>
				<div className="form-check form-check-inline">
					<input
						type="checkbox"
						className="form-check-input"
						value="Resolved"
						checked={filteredStatus.includes("Resolved")}
						onChange={handleFilterChange}
					/>
					<label className="form-check-label">Resolved</label>
				</div>
				<div className="form-check form-check-inline">
					<input
						type="checkbox"
						className="form-check-input"
						value="Rejected"
						checked={filteredStatus.includes("Rejected")}
						onChange={handleFilterChange}
					/>
					<label className="form-check-label">Rejected</label>
				</div>
			</div>

			<table className="table table-striped">
				<thead>
					<tr>
						<th onClick={() => requestSort("title")}>
							Title {getSortIcon("title")}
						</th>
						<th onClick={() => requestSort("description")}>
							Description {getSortIcon("description")}
						</th>
						<th onClick={() => requestSort("contactInfo")}>
							Contact {getSortIcon("contactInfo")}
						</th>
						<th onClick={() => requestSort("status")}>
							Status {getSortIcon("status")}
						</th>
						<th onClick={() => requestSort("createdAt")}>
							Created {getSortIcon("createdAt")}
						</th>
						<th onClick={() => requestSort("updatedAt")}>
							Updated {getSortIcon("updatedAt")}
						</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{filteredAndSortedTickets.map((ticket) => (
						<tr key={ticket.id}>
							<td>
								{ticket.title &&
									ticket.title
										.match(/.{1,30}/g)
										.map((line, index) => <div key={index}>{line}</div>)}
							</td>
							<td>
								{ticket.description &&
									ticket.description
										.match(/.{1,30}/g)
										.map((line, index) => <div key={index}>{line}</div>)}
							</td>
							<td>
								{ticket.contactInfo &&
									ticket.contactInfo
										.match(/.{1,30}/g)
										.map((line, index) => <div key={index}>{line}</div>)}
							</td>
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
