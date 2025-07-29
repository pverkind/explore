# KITAB explore 

A web portal for the [KITAB project](https://kitab-project.org).

The portal gives access to the [OpenITI corpus](https://openiti.org/projects/OpenITI%20Corpus.html) metadata 
and the [KITAB](https://kitab-project.org) text reuse data and visualisations.

The website is live at https://kitab-project.org/explore

![Kitab Logo](public/logo192.png) 

## Features

- **Extensive Collection:** Browse through a vast repository of historical Arabic books from the OpenITI corpus.
- **Metata Search Functionality:** Search for specific works by author, title and other metadata.
- **Explore Text Reuse Data:** visualize the text reuse relations between two books, or between one book and all other books in the corpus.
- **Download:** Download OpenITI text files and KITAB text reuse data.

## Getting Started

To get started with KITAB explore, follow these steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/kitab-project-org/explore.git
   ```

2. **Install Dependencies:**

   ```bash
   cd explore
   npm install
   ```

3. **Run the Application:**

   ```bash
   npm start
   ```

4. **Access the Application:**

   Open your web browser and navigate to http://localhost:8080.

## Github Pages Build Process

To build the file for gh-pages, follow these steps:

1. **Install Github Pages:**

   ```bash
   npm install gh-pages
   ```

2. **Add Scripts Inside package.json File:**

   "predeploy": "npm run build",
   "deploy": "gh-pages -d build",

3. **Build And Publish:**
   try to build the app with

   ```bash
   npm run build
   ```

   then run this code:

   ```bash
   npm run deploy
   ```

4. **Live Link:**

You will get the live link at this location - https://your-github-username.github.io/repo-name/

## Contributing

We welcome contributions to enhance the library and improve its features. To contribute:

    Fork the repository.
    Create a new branch for your feature: git checkout -b feature-name.
    Commit your changes: git commit -m 'Add some feature'.
    Push to the branch: git push origin feature-name.
    Submit a pull request.

## Issues

If you encounter any issues or have suggestions, please open an issue. We appreciate your feedback!
License - https://github.com/kitab-project-org/explore/issues/new

This project is licensed under the MIT License.

## End
