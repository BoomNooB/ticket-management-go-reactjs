package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func setupRouter() *gin.Engine {
	router := gin.Default()

	router.POST("/ticket", createTicket)
	router.GET("/tickets", getAllTicket)
	router.PUT("/ticket/:id", updateTicket)

	return router
}

func TestCreateTicket(t *testing.T) {
	router := setupRouter()

	ticket := TicketModel{
		Title:       "Test Ticket",
		Description: "This is a test ticket",
		ContactInfo: "test@example.com",
		Status:      "Ticket Created",
	}

	jsonTicket, _ := json.Marshal(ticket)

	req, _ := http.NewRequest("POST", "/ticket", bytes.NewReader(jsonTicket))
	resRecord := httptest.NewRecorder()

	router.ServeHTTP(resRecord, req)

	assert.Equal(t, http.StatusOK, resRecord.Code)

	var createdTicket TicketModel
	err := json.Unmarshal(resRecord.Body.Bytes(), &createdTicket)
	assert.NoError(t, err)

	assert.Equal(t, ticket.Title, createdTicket.Title)
	assert.Equal(t, ticket.Description, createdTicket.Description)
	assert.Equal(t, ticket.ContactInfo, createdTicket.ContactInfo)
	assert.Equal(t, ticket.Status, createdTicket.Status)
}

func TestGetAllTicket(t *testing.T) {
	router := setupRouter()
	req, _ := http.NewRequest("GET", "/tickets", nil)
	resRecord := httptest.NewRecorder()

	router.ServeHTTP(resRecord, req)

	// check status code
	assert.Equal(t, http.StatusOK, resRecord.Code)

	var Responsetickets []TicketModel
	err := json.Unmarshal(resRecord.Body.Bytes(), &Responsetickets)
	assert.NoError(t, err)

	// Check the format of each ticket
	for _, ticket := range Responsetickets {
		assert.NotEmpty(t, ticket.ID)
		assert.NotEmpty(t, ticket.Title)
		assert.NotEmpty(t, ticket.Description)
		assert.NotEmpty(t, ticket.ContactInfo)
		assert.NotEmpty(t, ticket.Status)
		assert.NotEmpty(t, ticket.CreatedAt)
		assert.NotEmpty(t, ticket.UpdatedAt)
	}
}

func TestUpdateTicket(t *testing.T) {
	router := setupRouter()

	//create ticket for update test

	ticketForUpdate := TicketModel{
		Title:       "Test Ticket for Update Test",
		Description: "This is a test ticket for Update Test",
		ContactInfo: "test@example.com",
		Status:      "Pending",
	}

	jsonticketForUpdate, _ := json.Marshal(ticketForUpdate)

	//send post to create new ticket for test
	createReq, _ := http.NewRequest("POST", "/ticket", bytes.NewReader(jsonticketForUpdate))
	createResRecord := httptest.NewRecorder()
	router.ServeHTTP(createResRecord, createReq)

	// check if its 200 or not
	assert.Equal(t, http.StatusOK, createResRecord.Code)

	// get all the data and use the id of latest one
	GetReq, _ := http.NewRequest("GET", "/tickets", nil)
	GetResRecord := httptest.NewRecorder()

	router.ServeHTTP(GetResRecord, GetReq)

	// check status code
	assert.Equal(t, http.StatusOK, GetResRecord.Code)

	var Responsetickets []TicketModel
	err := json.Unmarshal(GetResRecord.Body.Bytes(), &Responsetickets)
	assert.NoError(t, err)

	//store latest id in variable
	latestID := Responsetickets[len(Responsetickets)-1].ID.Hex()
	//edit text of ticket to update old ticket

	updatedTicket := TicketModel{
		Title:       "Updated Test Ticket",
		Description: "This is an updated test ticket",
		ContactInfo: "updated@test.com",
		Status:      "Rejected",
	}

	jsonUpdatedTicket, _ := json.Marshal(updatedTicket)

	//call put method to test
	PutReq, _ := http.NewRequest("PUT", "/ticket/"+latestID, bytes.NewReader(jsonUpdatedTicket))
	PutResRecord := httptest.NewRecorder()

	router.ServeHTTP(PutResRecord, PutReq)

	//check return code
	assert.Equal(t, http.StatusOK, PutResRecord.Code)

	//check is the data is equal or not

	var updatedTicketResponse TicketModel
	err = json.Unmarshal(PutResRecord.Body.Bytes(), &updatedTicketResponse)
	assert.NoError(t, err)

	assert.Equal(t, updatedTicket.Title, updatedTicketResponse.Title)
	assert.Equal(t, updatedTicket.Description, updatedTicketResponse.Description)
	assert.Equal(t, updatedTicket.ContactInfo, updatedTicketResponse.ContactInfo)
	assert.Equal(t, updatedTicket.Status, updatedTicketResponse.Status)

}

func TestMain(m *testing.M) {
	// Setup test environment
	mongoInit()

	// Run tests
	code := m.Run()

	// Clean up test environment
	// (e.g., close database connections, delete temporary files)

	os.Exit(code)
}
