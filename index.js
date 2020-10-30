
const content = require('fs').readFileSync(__dirname + '/index.html', 'utf8');

const httpServer = require('http').createServer((req, res) => {
  // serve the index.html file
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(content));
  res.end(content);
});

const io = require('socket.io')(httpServer);

io.on('connect',async (socket) => {
  
  //console.log('someone connected')
  let playerNumber = 0;
  var players = []
  var playerNames = []
  var positions = []
  var rotations = []
  //remove all players on server start / restart
      for(var i = 0; i < players.length; i++){
        players.splice(i,i)
      }

     
      socket.on('DataFromUnity', (data) => {
        console.log(data);
        ProcessData(data)
      })

    
        ProcessData = (data) => {
          var d = JSON.parse(data)
          console.log(d.action)
          

          io.emit('send', data); 

           /* 
          if(d.action == 'ping'){
            var dSend = '{"action":"pong","InitCredential":"'+d.InitCredential+'"}';
            socket.emit('send', dSend);
          }          

          if(d.action == 'addBuilding'){
            var dSend = data ;
            io.emit('send', dSend);                                  
          }

          if(d.action == 'moveObject'){
            var dSend = data;
            io.emit('send', dSend);
          }
          
          if(d.action == 'gotoObject'){
            var dSend = data;
            io.emit('send', dSend);
          }
          */
         

          
          console.log(data)
        }




      
            let counter = 0;
            setInterval(() => {
              socket.emit('hello', ++counter);
            }, 3000);

           

            socket.on('newPlayer', (u) => {
              pID = socket.id; 
              ++playerNumber;             
              //socket.broadcast.emit('addPlayer', pID, u)              
              //io.emit('addPlayer', pID, u)
              //io.to(pID).emit('addPlayer',pID,'me')
              //socket.broadcast.to(pID).emit('addPlayer', pID, 'me')
              players.push(pID)
              playerNames.push(u)
              
              var pos = {user:u, x:0 ,y:0 ,z:0}
              positions.push(pos)
              var rot = {user:u, x:0, y:0, z:0}
              rotations.push(rot)
              
              io.emit('LoadPlayers', pID, u, playerNumber)
              console.log('newPlayer')
            })

            socket.on('addAllPlayers', (u, pNum) => {                           
                  console.log(players.length);
                      for(var i = 0; i < players.length; i++){
                        io.emit('addPlayer', players[i], playerNames[i])
                      }
                  console.log('load players to a client ' + pID + " " + u + " " + pNum)
            })

            socket.on('updatePos', (pNumber, u, pos) => {
                io.emit('updatePos', u, pos)
                //positions[pNumber].x = pos.x;
                //positions[pNumber].y = pos.y;
                //positions[pNumber].z = pos.z;                
            })


            socket.on('chat message', (msg) => {
                console.log('message: ' + msg);
                  socket.emit('hello', msg , 1, 2, 'abc');
                    socket.broadcast.emit('hello', msg);
                });
            
            socket.on('moveUp', (u) => {              
              io.emit('moveUpNow', u)              
            })
            socket.on('moveDown', (u) => {              
              io.emit('moveDownNow', u)              
            }) 
            socket.on('moveLeft', (u) => {              
              io.emit('moveLeftNow', u)              
            }) 
            socket.on('moveRight', (u) => {              
              io.emit('moveRightNow', u)              
            }) 
            
            

            //remove a player when it close the app
      socket.on('disconnect', () => {
        console.log(socket.id + ' user disconnected');
        io.emit('removePlayer', socket.id) 
      });

});

httpServer.listen(3000, () => {
  console.log('server running on port 3000');
});
