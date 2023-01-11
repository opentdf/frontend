package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
)

const port = ":8080"
const directory = "/www"
const index = "index.html"

type ServerData struct {
	Attributes   string `json:"attributes"`
	Entitlements string `json:"entitlements"`
	Authority    string `json:"authority"`
	ClientId     string `json:"clientId"`
	Access       string `json:"access"`
	Realms       string `json:"realms"`
	BasePath     string `json:"basePath"`
}

func main() {
	log.Println("starting")
	// create server data REACT_APP_SERVER_DATA
	log.Println("populating")
	sd := &ServerData{
		Attributes:   os.Getenv("ATTRIBUTES_HOST"),
		Entitlements: os.Getenv("ENTITLEMENTS_HOST"),
		Authority:    os.Getenv("KEYCLOAK_HOST"),
		ClientId:     os.Getenv("KEYCLOAK_CLIENT_ID"),
		Access:       os.Getenv("KAS_HOST"),
		Realms:       os.Getenv("KEYCLOAK_REALMS"),
		BasePath:     os.Getenv("SERVER_BASE_PATH"),
	}
	emptyJson, _ := json.Marshal(&ServerData{})
	sdJson, err := json.Marshal(sd)
	if err != nil {
		log.Fatalln(err)
	}
	log.Println("populated")
	log.Printf("REACT_APP_SERVER_DATA=%s", string(sdJson))
	if bytes.Equal(emptyJson, sdJson) {
		log.Fatalln("env populating failed")
	}
	// replace %REACT_APP_SERVER_DATA% in index file
	m := regexp.MustCompile("%REACT_APP_SERVER_DATA%")
	input, err := os.ReadFile(filepath.Join(directory, index))
	if err != nil {
		log.Fatalln(err)
	}
	log.Println("replacing")
	output := m.ReplaceAllString(string(input), string(sdJson))
	if string(input) == output {
		log.Println(output)
		log.Fatalln("replacing failed")
	}
	// replace /%REACT_APP_SERVER_BASE_PATH% in index file
	r := regexp.MustCompile("/%REACT_APP_SERVER_BASE_PATH%")
	basePath := os.Getenv("SERVER_BASE_PATH")
	// make sure there is no double-slash
	if basePath == "/" {
		basePath = ""
	}
	output = r.ReplaceAllString(output, basePath)
	log.Println("replaced")
	// serve replaced index.html instead of writing it (permission issue)
	fs := http.FileServer(http.Dir(directory))
	http.Handle("/", &IndexHandler{
		output: []byte(output),
		fs:     fs,
	})
	log.Printf("listening %s\n", port)
	err = http.ListenAndServe(port, nil)
	if errors.Is(err, http.ErrServerClosed) {
		log.Printf("stopping\n")
	} else if err != nil {
		log.Fatalln(err)
	}
}

// IndexHandler servers index.html or falls back to file server
type IndexHandler struct {
	output []byte
	fs     http.Handler
}

func (h IndexHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Security-Policy", "frame-ancestors")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	if r.URL.Path == "/" || r.URL.Path == "/index.html" || r.URL.Path == "/authorities" || r.URL.Path == "/attributes" || r.URL.Path == "/entitlements" {
		log.Printf("serving root from %s", r.URL.Path)
		_, err := w.Write(h.output)
		if err != nil {
			log.Println(err)
			return
		}
		return
	}
	log.Printf("serving %s", r.URL)
	h.fs.ServeHTTP(w, r)
}
