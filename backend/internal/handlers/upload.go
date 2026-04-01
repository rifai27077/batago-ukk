package handlers

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
)

func UploadListingImage(c *gin.Context) {
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No image uploaded"})
		return
	}

	// Create uploads directory if not exists
	uploadDir := "./uploads/listings"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, 0755)
	}

	// Save with unique name
	ext := filepath.Ext(file.Filename)
	filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)
	dst := filepath.Join(uploadDir, filename)

	log.Printf("UploadListingImage: Saving file to %s", dst)
	if err := c.SaveUploadedFile(file, dst); err != nil {
		log.Printf("UploadListingImage Error: Failed to save file: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	// Return public URL with dynamic base URL
	scheme := "http"
	if c.Request.TLS != nil {
		scheme = "https"
	}
	baseURL := fmt.Sprintf("%s://%s", scheme, c.Request.Host)
	fileURL := fmt.Sprintf("%s/uploads/listings/%s", baseURL, filename)

	log.Printf("UploadListingImage Success: URL %s", fileURL)
	c.JSON(http.StatusOK, gin.H{
		"url": fileURL,
	})
}
