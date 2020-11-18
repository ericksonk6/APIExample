//code the API
//REST application means API works over HTTP
//Using request from the HTTP verbs:
// - POST //insert something into the data base
//- GET //get data from data base
//-PATCH / PUT // update
//-DELETE

// For the routes
let express = require('express');
let router = express.Router();
// For the Data Model
let FriendSchema = require('../models/friends');


function HandleError(response, reason, message, code){
    console.log('ERROR: ' + reason);
    response.status(code || 500).json({"error:": message});
}

router.post('/', (request, response, next) => {
    let newFriend = request.body;
    //console.log(request.body);
    if (!newFriend.firstName || !newFriend.lastName || !newFriend.phone){
        HandleError(response, 'Missing Info', 'Form data missing', 500);
    }else{
        let friend = new FriendSchema({
            firstName: newFriend.firstName,
            lastName: newFriend.lastName,
            phone: newFriend.phone,
            email: newFriend.email,
            birthday: newFriend.birthday,
            callAnytime: newFriend.callAnytime
        });
        friend.save((error) => {
            if (error){
                response.send({"error": error});
            }else{
                response.send({"id": friend.id});
            }
        });
    }
});

router.get('/', (request, response, next) => {
    let name = request.query['name'];
    if (name){
        FriendSchema
            .find({"firstName": name})
            .exec( (error, friends) => {
                if (error){
                    response.send({"error": error});
                }else{
                    response.send(friends);
                }
            });
    }else{
        FriendSchema
            .find()
            .exec( (error, friends) => {
                if (error){
                    response.send({"error": error});
                }else{
                    response.send(friends);
                }
            });
    }
    // FriendSchema
    //     .find()
    //     .exec( (error, friends) => {
    //         if (error){
    //             response.send({"error": error});
    //         }else{
    //             response.send(friends);
    //         }
    //     });
} );

router.get('/:id', (request, response, next) =>{
    FriendSchema
        .findOne({"_id": request.params.id}, (error, result) =>{
            if (error) {
                response.status(500).send(error);
            }
            if (result){
                response.send(result);
            }else{
                response.status(404).send({"id": request.params.id, "error":  "Not Found"});
            }

        });
});

router.patch('/:id', (request, response, next) =>{
    FriendSchema
        .findById(request.params.id, (error, result)=>{
            if (error) {
                response.status(500).send(error);
            }else if (result){
                if (request.body._id){
                    delete request.body._id;
                }
                for (let field in request.body){
                    result[field] = request.body[field];
                }
                result.save((error, friend)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                    response.send(friend);
                });
            }else{
                response.status(404).send({"id": request.params.id, "error":  "Not Found"});
            }

        });
});

router.delete('/:id', (request, response, next) =>{
    FriendSchema
        .findById(request.params.id, (error, result)=>{
            if (error) {
                response.status(500).send(error);
            }else if (result){
                result.remove((error)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                    response.send({"deletedId": request.params.id});
                });
            }else{
                response.status(404).send({"id": request.params.id, "error":  "Not Found"});
            }
        });
});


module.exports = router;
