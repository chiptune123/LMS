<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Commit][commit-shield]][commit-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<div align="center">
  <a href="https://github.com/chiptune123/LMS">
    <img src="https://i.imgur.com/neTJ38e.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">LibGrow - Library Management System</h3>

  <p align="center">
    A web application to effiency manage a libray!
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

Libgrow is a designed library management software that aims to simplify and improve library operations for both librarians and user. The Web application prioritizes simplicity and providing librarians with the tools needed to efficiently manage a library

Here's why:
* A user-based design. Allowing librarians to take control their library through dashboard screen and seperate space for user to explore their favorite book
* Has an Online Automate Lending Renewal System which reduce the workload for librarians.
* Utilize TinyMCE rich text editor, librarians can instantly post important announcements directly on the library’s website
* and more...

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

[![Node.js][Nodejs.org]][Nodejs-url] 
[![Express.js][expressjs.com]][Expressjs-url] 
[![MongoDB][MongoDB.com]][MongoDB-url] [![Javascript][Developer.mozilla.org/javascript]][Javascript-url]
[![Bootstrap][Bootstrap.com]][Bootstrap-url] [![Chartjs][Chartjs.org]][Chartjs-url]

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Clone the repo.
   ```sh
   git clone https://github.com/chiptune123/LMS.git
   ```
3. Install NPM packages.
   ```sh
   npm install
   ```
4. Set up dotenv: Create a `.env` file in the root of your project: 
   ```js
   mongoDBConnectionString="your_mongodb_connection_string"
   ```
4. Set up secret config file: Create a `.auth.config.js` file inside the `/config` folder of your project: 
   ```js
   module.exports = {
    secret: "put_your_secret_string_here"
   }
   ```
5. Run the application
   ```js
   npm run start
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

* Home Page
<img src="/public/screenshot/home-page.png" alt="Welcome Page">
* Login
<img src="/public/screenshot/login-page.png" alt="Announcement Page">
* Book Catalog
<img src="/public/screenshot/book-page.png" alt="Book Page"> 
* Announcement
<img src="/public/screenshot/announcement-page.png" alt="Announcement Page">
* Dashboard
<img src="/public/screenshot/dashboard-page.png" alt="Announcement Page">
* Member Management
<img src="/public/screenshot/member-management.png" alt="Announcement Page">
* Announcement Management
<img src="/public/screenshot/announcement-management-page.png" alt="Announcement Page">
* Contact 
<img src="/public/screenshot/contact-page.png" alt="Announcement Page">
* Signup
<img src="/public/screenshot/signup-page.png" alt="Announcement Page">

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Font Awesome](https://fontawesome.com)
* [Bootstrap Icon](https://icons.getbootstrap.com/)
* [KaiAdmin](https://www.themekita.com/)
* [TinyMCE](https://www.tiny.cloud/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/chiptune123/LMS?style=for-the-badge
[contributors-url]: https://github.com/chiptune123/LMS/graphs/contributors
[commit-shield]: https://img.shields.io/github/commit-activity/t/chiptune123/LMS?style=for-the-badge
[commit-url]: https://github.com/chiptune123/LMS/graphs/commit-activity
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/tienphatpham
[product-screenshot]: https://i.imgur.com/oom18tp.png
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[Nodejs.org]: https://img.shields.io/badge/Node.js-black?style=for-the-badge&logo=node.js
[Nodejs-url]: https://nodejs.org/
[Developer.mozilla.org/javascript]: https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[Javascript-url]: https://developer.mozilla.org/JavaScript
[expressjs.com]: https://img.shields.io/badge/Express-black?style=for-the-badge&logo=express
[Expressjs-url]: https://expressjs.com/
[Chartjs.org]: https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white
[Chartjs-url]: https://www.chartjs.org/
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
[MongoDB.com]: https://img.shields.io/badge/-MongoDB-13aa52?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/