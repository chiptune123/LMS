#! /usr/bin/env node

require('dotenv').config();
const mongoose = require('mongoose');

mongoose.set("strictQuery", false);
const mongoDBConnect = process.env.mongoDBConnectionString;

console.log(
    'This script populates test data to database'
);

const BookModel = require("./models/books");
const AuthorModel = require("./models/authors");
const AnnouncementModel = require("./models/announcements");
const CartModel = require("./models/carts");
const CommentModel = require("./models/comments");
const FeedbackModel = require("./models/feedbacks");
const ImportLogModel = require("./models/importLog");
const OrderItemModel = require("./models/orderItems");
const OrderModel = require("./models/orders");
const RenewalRequestModel = require("./models/renewalRequests");
const UserModel = require("./models/users");

const books = [];
const authors = [];
const announcements = [];
const carts = [];
const comments = [];
const feedbacks = [];
const importLogs = [];
const orderItems = [];
const orders = [];
const renewalRequests = [];
const users = [];

// Book data 


main().catch((err) => console.log(err));

async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDBConnect);
    console.log("Debug: database connected");
    await createGenres();
    await createAuthors();
    await createBooks();
    await createBookInstances();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
}


const announcementDetail = {
    createdAt: "2024-06-15",
    updatedAt: "2024-06-15",
    writerId: users[0],
    announcementContent: "<p>This is an <strong>example</strong> announcement.</p>\n<ul>\n  <li>List item 1</li>\n  <li>List item 2</li>\n</ul>"
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.

// Save to database functions
async function bookCreate(index, title, author, description, publisher, publish_date, page_numbers, price, quantity,
    ISBN_tenDigits, ISBN_thirteenDigits, coverPicturePath, uniqueBarcode, rating) {
    const bookDetail = {
        title: title,
        author: authors[index],
        description: description,
        publisher: publisher,
        publish_date: publish_date,
        page_numbers: page_numbers,
        price: price,
        quantity: quantity,
        ISBN_tenDigits: ISBN_tenDigits,
        ISBN_thirteenDigits: ISBN_thirteenDigits,
        coverPicturePath: coverPicturePath,
        uniqueBarcode: uniqueBarcode,
        rating: rating,
    }

    const book = new BookModel(bookDetail);

    await book.save();

    books[index] = book;
    console.log(`Added book: ${title}`);
}

async function authorCreate(index, name, bio, profilePicturePath, deleteStatus, deleteReason) {
    const authorDetail = {
        name: name,
        bio: bio,
        profilePicturePath: profilePicturePath,
        deleteStatus: deleteStatus,
        deleteReason: deleteReason,
    }

    const author = new AuthorModel(authorDetail);

    await author.save();

    authors[index] = author;
    console.log(`Added Author: ${name}`);
}

async function announcementCreate(index, createdAt, updatedAt, writerId, announcementContent) {
    const announcementDetail = {
        createdAt: createdAt,
        updatedAt: updatedAt,
        writerId: writerId,
        announcementContent: announcementContent,
    }

    announcement = new AnnouncementModel(announcementDetail);

    await announcement.save();
    announcements[index] = announcementDetail;

    console.log(`Add Announcement: ${index}`);
}

async function commentCreate() {
    // Not Implement
}

async function feedbackCreate(index, name, email, phoneNumber, feedbackType, feedbackStatus, feedbackMessage) {
    const feedbackDetail = {
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        feedbackType: feedbackType,
        feedbackStatus: feedbackStatus,
        feedbackMessage: feedbackMessage,
    }

    const feedback = new FeedbackModel(feedbackDetail);
    await feedback.save();

    feedbacks[index] = feedback;

    console.log(`Add feedback: ${index}`);
}

async function importLogCreate(index, createdAt, updatedAt, managerId, bookId, supplier, quantity) {
    const importLogDetail = {
        createdAt: createdAt,
        updatedAt: updatedAt,
        managerId: managerId,
        bookId: bookId,
        supplier: supplier,
        quantity: quantity,
    }

    const importLog = new ImportLogModel(importLogDetail);
    await importLog.save();

    importLogs[index] = importLog;

    console.log(`Add Import Log: ${index}`);
}

async function orderItemCreate(index, orderId, bookId, uniqueBarcode, returnDeadline, penaltyAmount, lendStatus, quantity) {
    const orderItemDetail = {
        orderId: orderId,
        bookId: bookId,
        uniqueBarcode: uniqueBarcode,
        returnDeadline: returnDeadline,
        penaltyAmount: penaltyAmount,
        lendStatus: lendStatus,
        quantity: quantity,
    }

    const orderItem = new OrderItemModel(orderItemDetail);
    await orderItem.save();

    orderItems[index] = orderItem;
    console.log(`Add Order Item: ${index}`);
}

async function orderCreate(index, createdAt, updatedAt, memberId, orderStatus, orderPreparer) {
    const orderDetail = {
        createdAt: createdAt,
        updatedAt: updatedAt,
        memberId: memberId,
        orderStatus: orderStatus,
        orderPreparer: orderPreparer,
    }

    const order = new OrderModel(orderDetail);
    await order.save();

    orders[index] = order;

    console.log(`Add Order: ${index}`);
}

async function renewalRequestCreate(index, createdAt, updatedAt, orderItemId, requestUser, librarianId, reason, requestExtendDate, requestStatus) {
    const renewalRequestDetail = {
        createdAt: createdAt,
        updatedAt: updatedAt,
        orderItemId: orderItemId,
        requestUser: requestUser,
        librarianId: librarianId,
        reason: reason,
        requestExtendDate: requestExtendDate,
        requestStatus: requestStatus,
    }

    const renewalRequest = new RenewalRequestModel(renewalRequestDetail);
    await renewalRequest.save();

    renewalRequests[index] = renewalRequest;

    console.log(`Add Renewal Request: ${index}`);
}

async function userCreate(index, username, password, name, email, phoneNumber, address, role, verificationStatus, profilePicture, deleteStatus, deleteReason) {
    const userDetail = {
        username: username,
        password: password,
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        address: address,
        role: role,
        verificationStatus: verificationStatus,
        profilePicture: profilePicture,
        deleteStatus: deleteStatus,
        deleteReason: deleteReason,
    }

    const user = new UserModel(userDetail);
    await user.save();

    users[index] = user;
    console.log(`Add User: ${index}`);
}

async function authorCreate(index, first_name, family_name, d_birth, d_death) {
    const authordetail = { first_name: first_name, family_name: family_name };
    if (d_birth != false) authordetail.date_of_birth = d_birth;
    if (d_death != false) authordetail.date_of_death = d_death;

    const author = new Author(authordetail);

    await author.save();
    authors[index] = author;
    console.log(`Added author: ${first_name} ${family_name}`);
}

// Run the function
async function createBooks() {
    console.log("Add Book:")

    await Promise.all([
        bookCreate(
            0,
            "Clean Code: A Handbook of Agile Software Craftsmanship",
            authors[0],
            "Even bad code can function. But if code isn’t clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. But it doesn\'t have to be that way.",
            "Pearson",
            "2008-08-01",
            464,
            45.99,
            10,
            "0132350882",
            "9780132350884",
            "https://i.imgur.com/KReTdbf.jpg",
            20240000000,
            3.89,
        ),
        bookCreate(
            1,
            "The Clean Coder: A Code of Conduct for Professional Programmers",
            author[0],
            "In The Clean Coder: A Code of Conduct for Professional Programmers, legendary software expert Robert C. Martin introduces the disciplines, techniques, tools, and practices of true software craftsmanship. This book is packed with practical advice–about everything from estimating and coding to refactoring and testing. It covers much more than technique: It is about attitude. Martin shows how to approach software development with honor, self-respect, and pride; work well and work clean; communicate and estimate faithfully; face difficult decisions with clarity and honesty; and understand that deep knowledge comes with a responsibility to act.",
            "Pearson",
            "2011-05-13",
            256,
            36.95,
            10,
            "0137081073",
            "9780137081073",
            "https://i.imgur.com/KvCQoIF.jpg",
            20240000001,
            5,
        ),
        bookCreate(
            2,
            "Refactoring: Improving the Design of Existing Code (2nd Edition)",
            author[1],
            "Refactoring is about improving the design of existing code. It is the process of changing a software system in such a way that it does not alter the external behavior of the code, yet improves its internal structure. With refactoring you can even take a bad design and rework it into a good one. This book offers a thorough discussion of the principles of refactoring, including where to spot opportunities for refactoring, and how to set up the required tests. There is also a catalog of more than 40 proven refactorings with details as to when and why to use the refactoring, step by step instructions for implementing it, and an example illustrating how it works The book is written using Java as its principle language, but the ideas are applicable to any OO language.",
            "Addison-Wesley Professional",
            "2018-11-30",
            448,
            20.99,
            10,
            "0134757599",
            "9780134757599",
            "https://i.imgur.com/yOunyFy.jpg",
            20240000002,
            4.45
        ),
        bookCreate(
            3,
            "Patterns of Enterprise Application Architecture",
            author[1],
            "Developers of enterprise applications (e.g reservation systems, supply chain programs, financial systems, etc.) face a unique set of challenges, different than those faced by their desktop system and embedded system peers. For this reason, enterprise developers must uncover their own solutions. In this new book, noted software engineering expert Martin Fowler turns his attention to enterprise application development. He helps professionals understand the complex -- yet critical -- aspects of architecture. While architecture is important to all application development, it is particularly critical to the success of an enterprise project, where issues such as performance and concurrent multi-user access are paramount. The book presents patterns (proven solutions to recurring problems) in enterprise architecture, and the context provided by the author enables the reader to make the proper choices when faced with a difficult design decision.",
            "Addison-Wesley Professional",
            "2002-11-05",
            560,
            32.99,
            10,
            "0321127420",
            "9780321127426",
            "https://i.imgur.com/cci97AK.jpg",
            20240000003,
            2.56,
        ),
        bookCreate(
            4,
            "Eloquent JavaScript, 3rd Edition: A Modern Introduction to Programming",
            author[2],
            "JavaScript lies at the heart of almost every modern web application, from social apps like Twitter to browser-based game frameworks like Phaser and Babylon. Though simple for beginners to pick up and play with, JavaScript is a flexible, complex language that you can use to build full-scale applications.",
            "No Starch Press",
            "2018-12-04",
            472,
            20.99,
            10,
            "1593279507",
            "9781593279509",
            "https://i.imgur.com/mWErfOz.jpg",
            20240000004,
            3
        ),
        bookCreate(
            5,
            "JavaScript: The Definitive Guide: Master the World's Most-Used Programming Language (7th Edition)",
            author[3],
            "JavaScript is the programming language of the web and is used by more software developers today than any other programming language. For nearly 25 years this best seller has been the go-to guide for JavaScript programmers. The seventh edition is fully updated to cover the 2020 version of JavaScript, and new chapters cover classes, modules, iterators, generators, Promises, async/await, and metaprogramming. You’ll find illuminating and engaging example code throughout.",
            "O'Reilly Media",
            "2020-06-23",
            704,
            40,
            10,
            "1491952024",
            "9781491952023",
            "https://i.imgur.com/oyxQVK1.jpg",
            20240000005,
            4,

        ),
        bookCreate(
            6,
            "Foundations of Software Testing ISTQB Certification, 4th edition",
            author[4],
            "Now in its fourth edition, Foundations of Software Testing: ISTQB Certification is the essential guide to software testing and to the ISTQB Foundation qualification. Completely updated to comprehensively reflect the most recent changes to the 2018 ISTQB Foundation Syllabus, the book adopts a practical, hands-on approach, covering the fundamental topics that every system and software tester should know. The authors are themselves developers of the ISTQB syllabus and are highly respected international authorities and teachers within the field of software testing. About ISTQB ISTQB is a multinational body overseeing the development of international qualifications in software testing. It offers an internationally recognized qualification that ensures there is an international, common understanding of software and system testing issues.",
            "Cengage Learning EMEA",
            "2019-08-09",
            288,
            59.99,
            10,
            "1473764793",
            "978-1473764798",
            "https://i.imgur.com/BOhsTOT.jpg",
            20240000006,
            4.4,
        ),
        bookCreate(
            7,
            "Software Engineering at Google: Lessons Learned from Programming Over Time 1st Edition",
            author[5],
            "Today, software engineers need to know not only how to program effectively but also how to develop proper engineering practices to make their codebase sustainable and healthy. This book emphasizes this difference between programming and software engineering.",
            "O'Reilly Media",
            "2020-04-07",
            599,
            32.99,
            10,
            "1492082791",
            "9781492082798",
            "https://i.imgur.com/PZh1479.jpg",
            20240000007,
        ),
        bookCreate(
            8,
            "System Design Interview - An Insider's Guide: Volume 2",
            author[6],
            "This book can be seen as a sequel to the book: System Design Interview - An Insider’s Guide. It covers a different set of system design interview questions and solutions. Although reading Volume 1 is helpful, it is not required. This book should be accessible to readers who have a basic understanding of distributed systems.",
            "Independently Published",
            "2020-06-12",
            322,
            39.99,
            10,
            "1736049119",
            "9781736049112",
            "https://i.imgur.com/1ggp6Ti.jpg",
            20240000008,
        ),
        bookCreate(
            9,
            "Docker Deep Dive",
            author[7],
            "It provides comprehensive explanations of core concepts and offers step-by-step guidance on creating and managing containerized applications in the real world – from source code to executing in the cloud. If you are looking for a comprehensive resource to help you master Docker and containers in the real world, this book is for you. It also gives you valuable knowledge, skills, insights, and tips to help you confidently navigate the container and cloud-native ecosystems.",
            "Packt Publishing",
            "2023-05-26",
            307,
            47.49,
            10,
            "1916585256",
            "9781916585256",
            "https://i.imgur.com/yviGiQf.jpg",
            2024000009,
        )
    ])
}

async function createAuthor() {
    console.log("Add author:");

    await Promise.all([
        authorCreate(
            0,
            "Robert Cecil Martin",
            "Robert Cecil Martin (colloquially known as Uncle Bob) is an American software engineer and author. He is a co-author of the Agile Manifesto.",
            "img",
            false,
            "",
        ),
        authorCreate(
            1,
            "Martin Fowler",
            "For all of my career I've been interested in the design and architecture of software systems, particularly those loosely classed as Enterprise Applications. I firmly believe that poor software design leads to software that is difficult to change in response to growing needs, and encourages buggy software that saps the productivity of computer users everywhere.",
            "img",
            false,
            "",
        ),
        authorCreate(
            2,
            "Marijn Haverbeke",
            "Marijn Haverbeke is a programming language enthusiast and polyglot. He's worked his way from trivial BASIC games on the Commodore, through a C++ phase, to the present where he mostly hacks on database systems and web APIs in dynamic languages. He recently won the JS1K—JavaScript demo in 1024 bytes—contest, and is the author of a wide range of open-source software.",
            "img",
            false,
            "",
        ),
        authorCreate(
            3,
            "David Flanagan",
            "David Flanagan is a computer programmer who has spent much of the last 20 years writing books about programming languages. He now works at Mozilla. David lives with his wife and children in the Pacific Northwest, between the cities of Seattle and Vancouver.",
            "img",
            false,
            "",
        ),
        authorCreate(
            4,
            "Rex black",
            "With thirty years of software and systems engineering experience, Rex Black is President of RBCS (www.rbcs-us.com), a leader in software, hardware, and systems testing. For almost twenty years, RBCS has delivered consulting, outsourcing and training services in the areas of software, hardware, and systems testing and quality.",
            "img",
            false,
            "",
        ),
        authorCreate(
            5,
            "Titus Winters",
            "Titus Winters is a Senior Staff Software Engineer at Google, where he has worked since 2010. Today, he is the chair of the global subcommittee for the design of the C++ standard library.",
            "img",
            false,
            "",
        ),
        authorCreate(
            6,
            "Alex Xu",
            "Alex Xu is an experienced software engineer and entrepreneur. Previously, he worked at Twitter, Apple and Zynga. ",
            "img",
            false,
            "",
        ),
        authorCreate(
            7,
            "Nigel Poulton",
            "Nigel Poulton is an author, video trainer, and consultant in the field of cloud computing and storage technologies. He has authored several books, including \"The Kubernetes Book,\" \"Docker Deep Dive,\" and \"Quick Start Kubernetes,\" which have become go-to resources for IT professionals worldwide.",
            "img",
            false,
            "",
        ),
    ])
}

async function createAnnouncement() {
    console.log("Add announcement:");

    await Promise.all([
        announcementCreate(
            0,
            "2024-06-01",
            "2024-06-01",
            users[0],
            "This is announcement on June"
        ),
        announcementCreate(
            1,
            "2024-07-01",
            "2024-07-01",
            users[0],
            "This is announcement on July"
        )
    ])
}

async function createFeedback() {
    console.log("Add feedback:");

    await Promise.all([
        feedbackCreate(
            0,
            "Jason",
            "Jason@gmail.com",
            "999-999-9999",
            "Question",
            "Pending",
            "How do I return a book?"
        ),
        feedbackCreate(
            1,
            "Liam",
            "Liam@gmail.com",
            "999-999-9999",
            "Bug",
            "Completed",
            "I can't change my profile picture!!!!",
        ),
        feedbackCreate(
            2,
            "James",
            "James@gmail.com",
            "999-999-9999",
            "Suggestion",
            "Pending",
            "Please add more books!",
        ),
        feedbackCreate(
            3,
            "Benjamin",
            "Benjamin@gmail.com",
            "999-999-9999",
            "Compliment",
            "Good service! highly recommend",
        )
    ]);
}

async function createImportLog() {
    console.log("Add import log:");

    await Promise.all([
        importLogCreate(
            0,
            "2024-06-01",
            "2024-06-01",
            users[0],
            books[0],
            "Pearson",
            10,
        ),
        importLogCreate(
            1,
            "2024-06-01",
            "2024-06-01",
            users[0],
            books[1],
            "Pearson",
            10,
        ),
        importLogCreate(
            2,
            "2024-06-01",
            "2024-06-01",
            users[0],
            books[2],
            "Addison-Wesley Professional",
            10,
        ),
        importLogCreate(
            3,
            "2024-06-01",
            "2024-06-01",
            users[0],
            books[3],
            "Addison-Wesley Professional",
            10,
        ),
        importLogCreate(
            4,
            "2024-06-01",
            "2024-06-01",
            users[0],
            books[4],
            "No Starch Press",
            10
        ),
        importLogCreate(
            5,
            "2024-06-01",
            "2024-06-01",
            users[0],
            books[5],
            "O'Reilly Media",
            10,
        ),
        importLogCreate(6,
            6,
            "2024-06-01",
            "2024-06-01",
            users[0],
            books[6],
            "Cengage Learning EMEA",
            10,
        ),
        importLogCreate(
            7,
            "2024-06-01",
            "2024-06-01",
            users[0],
            books[7],
            "O'Reilly Media",
            10,

        ),
        importLogCreate(
            8,
            "2024-06-01",
            "2024-06-01",
            users[0],
            books[8],
            "Independently Published",
            10,
        ),
        importLogCreate(
            9,
            "2024-06-01",
            "2024-06-01",
            users[0],
            books[9],
            "Packt Publishing",
            10,
        ),
    ]);
}

async function createOrder() {
    console.log("Create order:");

    await Promise.all([
        orderCreate(
            0,
            "2024-06-01",
            "2024-06-01",
            users[1],
            "Processing",
            "",
        ),
        orderCreate(
            1,
            "2024-06-01",
            "2024-06-02",
            users[5],
            "Ready for Pick Up",
            users[1],
        ),
        orderCreate(
            2,
            "2024-06-01",
            "2024-06-05",
            users[6],
            "Completed",
            users[1],
        ),
        orderCreate(3,
            "2024-06-01",
            "2024-06-05",
            users[7],
            "Completed",
            users[1],
        ),
        orderCreate(
            4,
            "2024-06-01",
            "2024-06-03",
            users[8],
            "Completed",
            users[1],
        ),
    ])
}

async function createOrderItem() {
    console.log("Add order item:");

    await Promise.all([
        orderItemCreate(
            0,
            orders[0],
            books[0],
            books[0].uniqueBarcode,
            "2024-09-01",
            0,
            "",
            1,
        ),
        orderItemCreate(
            1,
            orders[1],
            books[1],
            books[1].uniqueBarcode,
            "2024-09-01",
            0,
            "",
            1,
        ),
        orderItemCreate(
            2,
            orders[2],
            books[2],
            books[2].uniqueBarcode,
            "2024-09-01",
            0,
            "Borrowed",
            1
        ),
        orderItemCreate(
            3,
            orders[3],
            books[3],
            books[3].uniqueBarcode,
            "2024-07-01",
            0,
            "Returned",
            1,
        ),
        orderItemCreate(
            4,
            orders[4],
            books[4],
            books[4].uniqueBarcode,
            "2024-07-01",
            50,
            "Overdue",
        ),
    ])
}

async function createRenewalRequest() {
    console.log("Add renewal request");

    await Promise.all([
        renewalRequestCreate(
            0,
            "2024-06-01",
            "2024-06-01",
            orders[4],
            users[8],
            users[1],
            "I need more time for the book!!!",
            "2024-09-01",
            "Denided",
        )
    ])
}

async function createUser() {
    console.log("Add user:")

    await Promise.all([
        userCreate(
            0,
            "chiptune",
            "$2a$08$7hkynuYVOaiELCEJz3TYP.7k7XjGaPelW56U6STlfQEz7T0L2s/xa",
            "Pham",
            "chiptune@gmail.com",
            "999-999-9999",
            "999 Campfire Court Gibsonia, PA 99999",
            "Admin",
            true,
            "img",
            false,
            ""
        ),
        userCreate(
            1,
            "chiptune1",
            "$2a$08$7hkynuYVOaiELCEJz3TYP.7k7XjGaPelW56U6STlfQEz7T0L2s/xa",
            "Pham",
            "chiptune1@gmail.com",
            "999-999-9999",
            "9999 Purple Finch Rd. Cranberry Twp, PA 99999",
            "Librarian",
            true,
            "img",
            false,
            ""
        ),
        userCreate(
            2,
            "chiptune2",
            "$2a$08$7hkynuYVOaiELCEJz3TYP.7k7XjGaPelW56U6STlfQEz7T0L2s/xa",
            "Pham",
            "chiptune2@gmail.com",
            "999-999-9999",
            "9999 North Monroe CourtWarren, MI 99999",
            "User",
            true,
            "img",
            false,
            ""
        ),
        userCreate(
            3,
            "james",
            "$2a$08$7hkynuYVOaiELCEJz3TYP.7k7XjGaPelW56U6STlfQEz7T0L2s/xa",
            "James",
            "james@gmail.com",
            "999-999-9999",
            "813 Victoria St. Charlotte, NC 28205",
            "User",
            true,
            "img",
            false,
            ""
        ),
        userCreate(
            4,
            "jason",
            "$2a$08$7hkynuYVOaiELCEJz3TYP.7k7XjGaPelW56U6STlfQEz7T0L2s/xa",
            "Jason",
            "jason@gmail.com",
            "111-111-1111",
            "137 Westminster Court Wakefield, MA 01880",
            "User",
            true,
            "img",
            false,
            ""
        ),
        userCreate(
            5,
            "liam",
            "$2a$08$7hkynuYVOaiELCEJz3TYP.7k7XjGaPelW56U6STlfQEz7T0L2s/xa",
            "Liam",
            "liam@gmail.com",
            "999-999-9999",
            "850 Schoolhouse Street Manchester Township, NJ 08759",
            "User",
            true,
            "img",
            false,
            ""
        ),
        userCreate(
            6,
            "henry",
            "$2a$08$7hkynuYVOaiELCEJz3TYP.7k7XjGaPelW56U6STlfQEz7T0L2s/xa",
            "Henry",
            "henry@gmail.com",
            "999-999-9999",
            "40 Brookside Avenue Ottumwa, IA 52501",
            "User",
            true,
            "img",
            false,
            ""
        ),
        userCreate(
            7,
            "noah",
            "$2a$08$7hkynuYVOaiELCEJz3TYP.7k7XjGaPelW56U6STlfQEz7T0L2s/xa",
            "Noah",
            "noah@gmail.com",
            "999-999-9999",
            "7141 Bear Hill Ave. Pasadena, MD 21122",
            "User",
            true,
            "img",
            false,
            ""
        ),
        userCreate(
            8,
            "oliver",
            "$2a$08$7hkynuYVOaiELCEJz3TYP.7k7XjGaPelW56U6STlfQEz7T0L2s/xa",
            "Oliver",
            "oliver@gmail.com",
            "999-999-9999",
            "7578B Paris Hill Dr. Woodside, NY 11377",
            "User",
            true,
            "img",
            false,
            ""
        ),
        userCreate(
            9,
            "william",
            "$2a$08$7hkynuYVOaiELCEJz3TYP.7k7XjGaPelW56U6STlfQEz7T0L2s/xa",
            "William",
            "william@gmail.com",
            "222-222-2222",
            "5 Glenridge Lane Loganville, GA 30052",
            "User",
            true,
            "img",
            true,
            "Student was graduated"
        ),
    ])


}
