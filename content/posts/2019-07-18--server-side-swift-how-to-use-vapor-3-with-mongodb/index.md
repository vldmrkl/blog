---
title: 'Server-side Swift: How To Use Vapor 3 With MongoDB'
cover: cover.png
author: Volodymyr Klymenko
---

<re-img src="cover.png"></re-img>

I’m working on a side project, which is an iOS app, and it is going to communicate with a database. I had to select a tech stack for my back-end, and I chose an interesting and rare at the same time tech stack for the back-end.

I decided to give a try to server-side Swift, and I selected <a href="https://vapor.codes/" target="_blank" rel="noopener noreferrer">Vapor</a> as a Swift back-end framework. Then, I needed a NoSQL database, and I chose <a href="https://www.mongodb.com/" target="_blank" rel="noopener noreferrer">MongoDB</a>.

I couldn’t find much information on the web on how to use combine these technologies, so I decided to figure out it by myself and share some of my learnings and knowledge on this topic.

### Prerequisites
- <a href="https://docs.mongodb.com/manual/installation/" target="_blank" rel="noopener noreferrer">Install MongoDB</a>
- Host your MongoDB on a hosting service of your choice or run it locally on your machine
- Basic experience with <a href="https://vapor.codes/" target="_blank" rel="noopener noreferrer">Vapor 3</a>
- Install Vapor 3 (<a href="https://docs.vapor.codes/3.0/install/macos/" target="_blank" rel="noopener noreferrer">macOS</a>/<a href="https://docs.vapor.codes/3.0/install/ubuntu/" target="_blank" rel="noopener noreferrer">Ubuntu</a>)
- <a href="https://docs.vapor.codes/3.0/getting-started/toolbox/" target="_blank" rel="noopener noreferrer">Create a Vapor application</a>

## MongoSwift Installation
In order to work with MongoDB in Swift applications, you need a MongoDB driver for Swift. There was a couple of driver options:
- <a href="https://github.com/mongodb/mongo-swift-driver" target="_blank" rel="noopener noreferrer">MongoSwift</a>
- <a href="https://github.com/OpenKitten/MongoKitten" target="_blank" rel="noopener noreferrer">MongoKitten</a>

I decided to go with MongoSwift because it’s an official MongoDB driver for Swift developed by mongodb.

Let’s install MongoSwift in our application.

First, run the following command to install mongo c driver:
```shell
brew install mongo-c-driver
```

Then, add MongoSwift to the `Package.swift`. Your package should look like (the highlighted line is the one you need to add):
```swift
import PackageDescription
let package = Package(
    name: "AppName",
    products: [
        .library(name: "AppName", targets: ["App"]),
    ],
    dependencies: [
        .package(url: "https://github.com/vapor/vapor.git", from: "3.0.0"),
        .package(url: "https://github.com/mongodb/mongo-swift-driver.git", from: "0.1.3")
    ],
    targets: [
        .target(name: "App", dependencies: ["Vapor", "MongoSwift"]),
        .target(name: "Run", dependencies: ["App"]),
        .testTarget(name: "AppTests", dependencies: ["App"])
    ]
)
```

Then run:
```shell
swift build
```

That’s it! If there are no errors, you are set up to build some cool stuff with MongoDB and Vapor 😀👏

## How To Work with MongoDB In a Vapor App
Let’s build a small server that would perform CRUD operations in our MongoDB. I’m going to write 4 endpoints for: <br />
_1._ creating a user and adding it to the database<br />
_2._ reading a users collection from the database and returning a list of usernames<br />
_3._ updating the user by id<br />
_4._ deleting the user by id<br />

Where user is a simple data structure that contains id (integer), username (string), and password(string).

We can start with creating a data model for our server. Create a `User.swift` file inside the `Models` folder of the App and put the following structure there:
```swift
import Vapor
struct User: Content {
  var id: Int
  var username: String?
  vr password: String?
}
```

### Configuration
Now, let’s configure our app. Go to `configure.swift` and add the following code inside `configure` function:
```swift
let client = try MongoClient("mongodb://localhost:27017")
let db = client.db("vaporapp")
do {
  _ = try db.createCollection("users")
} catch {
  _ = db.collection("users")
}
services.register(client)
```

The first line create a connection to MongoDB server. If you’re connecting to mongo’s default port on your localhost, you might omit passing the connection string parameter.

Next, I initialize an instance of `vaporapp` database. After that, I create a collection called `users` if it doesn’t exist. Lastly, we register our `client`, so we can access it later in the app.

Also, add the following line of code in the end of the file, so our `MongoClient` conforms to Vapor’s `Service`.
```swift
extension MongoClient: Service {}
```

Configuration part of this tutorial is done ✅

# Endpoints implementation
## CREATE
The first endpoint of our server is going to be a **POST** request that would accept a `user` JSON object and insert it to the database. Add a user route inside `routes.swift` with the following content:
```swift
router.post("user") { req -> Future<HTTPStatus> in
    return try req.content.decode(User.self).map(to: HTTPStatus.self) { user in
        let client = try! req.make(MongoClient.self)
        let collection = client.db("vaporapp").collection("users", withType: User.self)
        _ = try! collection.insertOne(user)
        return .ok
    }
}
```

Let me walk you through the code:<br />
_1._ In the first line, I register a post request for `/user` route, and I specify the return value of the closure (`Future<HTTPStatus>`). If you are not familiar with Futures, read  <a href="https://www.vaporforums.io/viewThread/45" target="_blank" rel="noopener noreferrer">this article</a>.<br />
_2._ It does exactly what it says: it decodes the content from the request and maps it to the closure’s return value. The `user` parameter in the end is the instance of the object being passed by the request.<br />
_3._ `client` is, basically, the MongoClient we made in the `configure.swift`.<br />
_4._ `collection` access the users collection from `vaporapp` database, and associates it with `User` type.<br />
_5._ This is where insertion to the database happens. `user` instance is passed as an argument.<br />
_6._ Return `.ok` HTTPStatus.<br />

It’s time to test this endpoint!

First of all, make sure that the Vapor app is running:
_1._ `vapor build`
_2._ `vapor run`

A default port is `8080`.

I use <a href="https://www.getpostman.com/" target="_blank" rel="noopener noreferrer">Postman</a> to test my APIs during the development. Here is my request to the newly created endpoint:
<img src="https://i.imgur.com/k5Mwon0.png" />

I sent a POST request with the request body (that you can see on the screenshot above). You can see the successful response with status 200 in the bottom right corner.

## READ
Now, let’s implement an endpoint for retrieving a list of usernames from our database. Let’s code a **GET** method `/users` route:
```swift
router.get("users") { req -> [String] in
    let client = try! req.make(MongoClient.self)
    let collection = client.db("vaporapp").collection("users", withType: User.self)
    let cursor = try! collection.find()
    var usernames = [String]()
    for document in cursor {
        if let username = document.username {
            usernames.append(username)
        }
    }
    return usernames
}
```

First few lines are pretty similar to what we’ve done in the first `POST` method (note that I use `router.get` instead of `router.post`). Next, I use a `find()` method of the collection instance, which returns a mongo cursor that is being used for working with documents in the database. Note, you can pass a filter query as a parameter of `find()` if you need to search for a specific document.

Then, I iterate documents in the cursor, and push a username property of each document into my `usernames` string array. Finally, I return the `usernames`, and let’s take a look at the output from my **GET** request:
<img src="https://i.imgur.com/4ormgUO.png" />

The request returned `volodymyr` user, which had been added earlier.

## UPDATE
The next endpoint would be a **PUT** request that updates a specific user (username, password) by using id of the user. Let’s get straight to the coding:
```swift
router.put("user") { req -> Future<HTTPStatus> in
    return try req.content.decode(User.self).map(to: HTTPStatus.self) { user in
        let client = try! req.make(MongoClient.self)
        let collection = client.db("vaporapp").collection("users", withType: User.self)
        let query: Document = ["id": user.id]
        let updatedUser: Document = ["$set": ["username": user.username!, "password": user.password!] as Document]
        _ = try! collection.updateOne(filter: query, update: updatedUser)
        return .ok
    }
}
```

The first part of the code is the same to what we’ve seen earlier (note that I use `router.put`). It decodes the body of the request and creates the client and collection variables.

Then, I create a `query` of MongoSwift’s `Document` type, which is, basically, a struct that represents the BSON document type. As you can see, the query I made will look for a `user.id` that we’re getting from the request body. Also, I made an `updatedUser` variable of the `Document` type, which I’m going to use in my update method call. It specifies new username and password in its definition.

After that, I simply call `collection.updateOne` with the `filter: query` and `update: updatedUser` arguments. This line of code will look for a user with specified id, and update the username and password of that user.

Let’s test it! I’m going to send a **PUT** request with the following request body:
<img src="https://i.imgur.com/43mYoPV.png" />

Here, I’m using an id of the user I’ve created earlier, but I’m using a new username and a new password. I got a successful response from the server (see right bottom corner) after sending this request.

Now, the updated username should be `volodymyr10` now instead of just `volodymyr`, and the user should have a new password: `newPassword`. Let’s send a GET request to `http://localhost:8080/users` in order to confirm that user’s info was updated:
<img src="https://i.imgur.com/Bo0CgI6.png" />

It returned an updated username.

## DELETE

Finally, let’s take a look at how to implement a user deletion endpoint:
```swift
router.delete("user", Int.parameter) { req -> HTTPStatus in
    let userId = try req.parameters.next(Int.self)
    let client = try! req.make(MongoClient.self)
    let collection = client.db("vaporapp").collection("users", withType: User.self)
    let query: Document = ["id": userId]
    _ = try! collection.deleteOne(query)
    return .ok
}
```

This code is almost the same as our `router.put` function but a little bit simpler. Here, I read user's id from the request’s parameter and assign it to `userId` variable. Then, I create the `client`, `collection`, and `query` variables in exactly the same way as I did in the previous endpoint.

Lastly, I call `collection.deleteOne` with the `query` I’ve made. It will look for a document that has that user id and delete it from the database.

Time to test it! First, I want to add some more users to the database. I’ve sent a couple of POST requests with the new users, and here is a new list of users:
<img src="https://i.imgur.com/5XebWOA.png" />

Now, let’s try to delete `volodymyr10` user. I’m sending a **DELETE** request to `http://localhost:8080/user/1`:
<img src="https://i.imgur.com/B0DPskj.png" />

I got a successful response with status 200 (see the bottom right corner). Let’s see the list of users now:
<img src="https://i.imgur.com/VC2H8JX.png" />

User `volodymyr10` is gone!
