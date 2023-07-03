# Simple Ticket Management System SPA

Here is a single page application ticket management system. You can try and use it [here](https://ticket-management-go-reactjs.vercel.app/).

Please note that this ticket management system does not support ticket deletion. Instead, it focuses on maintaining the current status of tickets. This approach allows you to track the current state of each ticket and manage their progress.

If you have any questions or need further assistance, you can contact me at [thatpong.com](https://www.thatpong.com).


## Tech Stack
- Front-end: **React.js**
- Back-end: **Go** with **Gin**
- Database: **MongoDB**

## Usage Guide

### Front-end
- All front-end files are located in the `frontend` folder.
- To install the dependencies, run `npm install`.
- To start the development server, run `npm run dev`.

### Back-end
- All front-end files are located in the `backend` folder.
- To install the Go dependencies, run `go mod tidy`.
- To run the back-end server, execute `go run main.go`.
- And there is a test file named `main_test.go` and it can be run with `go test`

## Data Model in MongoDB
```go
type TicketModel struct {
	ID          primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Title       string             `json:"title" bson:"title"`
	Description string             `json:"description" bson:"description"`
	ContactInfo string             `json:"contactInfo" bson:"contactInfo"`
	Status      string             `json:"status" bson:"status"`
	CreatedAt   time.Time          `json:"createdAt" bson:"createdAt"`
	UpdatedAt   time.Time          `json:"updatedAt" bson:"updatedAt"`
}
```

## API Endpoints

### GET /tickets
- This endpoint fetches all data from the collection and returns it as the response.
- Path: `https://long-erin-calf-gear.cyclic.app/tickets`

### POST /ticket
- This endpoint creates a new ticket.
- The default of ticket status will be : Ticket Created
- Path: `https://long-erin-calf-gear.cyclic.app/ticket`
- Request Body:
  ```json
  {
    "title": "The Title Of Ticket",
    "description": "What's about this ticket",
    "contactInfo": "Who to contact",
  }
  ```

### PUT /ticket/:id
- This endpoint updates an existing ticket specified by its ID.
- Path: `https://long-erin-calf-gear.cyclic.app/ticket/:id`
- Request Body:
  ```json
  {
    "title": "Updated Ticket Title",
    "description": "This is an updated test ticket",
    "contactInfo": "Update contact",
    "status": "Accepted"
  }
  ```

Please note that the front-end side is deployed on **Vercel**, and the back-end side is deployed on **Cyclic.sh**, which is **_serverless_**. This setup might cause a delay when using the application after a period of inactivity.
---
&copy; [BoomNooB](https://thatpong.com) 2023 - Built from scratch

