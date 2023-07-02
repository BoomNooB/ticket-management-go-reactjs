package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	// "github.com/gin-contrib/cors" //cors

	// for router
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv" // use env for credential info

	//mongodb driver
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type TicketModel struct {
	ID          primitive.ObjectID `json:"id" bson:"_id,omitempty"` //recommend to use primitive for mongoDB
	Title       string             `json:"title" bson:"title"`
	Description string             `json:"description" bson:"description"`
	ContactInfo string             `json:"contactInfo" bson:"contactInfo"`
	Status      string             `json:"status" bson:"status"`
	CreatedAt   time.Time          `json:"createdAt" bson:"createdAt"`
	UpdatedAt   time.Time          `json:"updatedAt" bson:"updatedAt"`
}

var (
	collection *mongo.Collection
	ctx        = context.TODO()
)

// init mongoDB connect
func mongoInit() {

	//get env file
	err := godotenv.Load("local.env")
	if err != nil {
		log.Print("Loading env error:", err)
	}

	//set client option
	clientOptions := options.Client().ApplyURI(os.Getenv("MONGO_URI"))

	//connect to mongoDB
	client, err := mongo.Connect(ctx, clientOptions)

	if err != nil {
		log.Fatal(err)
	}

	//make sure about the connection
	err = client.Ping(context.TODO(), nil)

	if err != nil {
		log.Fatal(err)
	}

	log.Print("connected to MongoDB Succesfully!")

	collection = client.Database("helpdesk").Collection("tickets")

}

func createTicket(c *gin.Context) {
	var ticket TicketModel
	// ใช้ shouldbind เพราะจะ handle error เอง
	if err := c.ShouldBindJSON(&ticket); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid ticket data",
		})
		return
	}

	ticket.CreatedAt = time.Now()
	ticket.UpdatedAt = ticket.CreatedAt

	_, err := collection.InsertOne(ctx, ticket)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create ticket",
		})
		return
	}

	c.JSON(http.StatusOK, ticket) // send ticket

}

func getAllTicket(c *gin.Context) {
	var tickets []TicketModel

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch for tickets",
		})
	}

	if err = cursor.All(ctx, &tickets); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch for tickets",
		})
	}

	c.JSON(http.StatusOK, tickets)
}

func updateTicket(c *gin.Context) {
	var updatedTicket TicketModel
	id := c.Param("id")

	if err := c.ShouldBindJSON(&updatedTicket); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid ticket data",
		})
		return
	}

	updatedTicket.UpdatedAt = time.Now()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid ticket ID",
		})
		return
	}

	filter := bson.M{"_id": primitive.ObjectID(objID)}

	update := bson.M{
		"$set": bson.M{
			"title":       updatedTicket.Title,
			"description": updatedTicket.Description,
			"contactInfo": updatedTicket.ContactInfo,
			"status":      updatedTicket.Status,
			"updatedAt":   updatedTicket.UpdatedAt,
		},
	}

	// Perform the update operation
	result, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update ticket",
		})
		return
	}

	// Check if any document was modified
	if result.ModifiedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Ticket not found",
		})
		return
	}

	updatedTicket.ID = objID
	err = collection.FindOne(ctx, filter).Decode(&updatedTicket)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch updated ticket",
		})
		return
	}

	c.JSON(http.StatusOK, updatedTicket)
}

func main() {

	mongoInit()

	r := gin.Default()
	r.POST("/ticket", createTicket)
	r.GET("/tickets", getAllTicket)
	r.PUT("ticket/:id", updateTicket)
	r.Run() // listen and serve

}
