package service

import (
	"io"
	"log"
	"os"
	"strconv"

	"gopkg.in/gomail.v2"
)

type EmailService interface {
	SendEmailWithAttachment(to string, subject string, body string, attachment []byte, filename string) error
}

type smtpEmailService struct {
	host     string
	port     int
	username string
	password string
	from     string
}

func NewEmailService() EmailService {
	port, _ := strconv.Atoi(os.Getenv("SMTP_PORT"))
	if port == 0 {
		port = 587
	}
	
	return &smtpEmailService{
		host:     os.Getenv("SMTP_HOST"),
		port:     port,
		username: os.Getenv("SMTP_USER"),
		password: os.Getenv("SMTP_PASS"),
		from:     os.Getenv("SMTP_FROM"),
	}
}

func (s *smtpEmailService) SendEmailWithAttachment(to string, subject string, body string, attachment []byte, filename string) error {
	// If credentials are missing, log and skip (for dev/demo)
	if s.host == "" || s.username == "" {
		log.Printf("--------------------------------------------------")
		log.Printf("SMTP NOT CONFIGURED. LOGGING EMAIL CONTENT:")
		log.Printf("TO: %s", to)
		log.Printf("SUBJECT: %s", subject)
		log.Printf("ATTACHMENT: %s (%d bytes)", filename, len(attachment))
		log.Printf("--------------------------------------------------")
		return nil
	}

	m := gomail.NewMessage()
	m.SetHeader("From", s.from)
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", body)

	m.Attach(filename, gomail.SetCopyFunc(func(w io.Writer) error {
		_, err := w.Write(attachment)
		return err
	}))

	d := gomail.NewDialer(s.host, s.port, s.username, s.password)

	if err := d.DialAndSend(m); err != nil {
		log.Printf("Failed to send email to %s: %v", to, err)
		return err
	}

	log.Printf("Email successfully sent to %s with attachment %s", to, filename)
	return nil
}
