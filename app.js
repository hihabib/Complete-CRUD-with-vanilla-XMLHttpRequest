// Create elemtent
        function postBody(postTitle, postDescription, postId){

            // create grid
            const postBody = document.createElement('div');
            postBody.classList.add('col-md-3');
            postBody.setAttribute('id', 'postId'+postId);

            // create card
            const card = document.createElement('div');
            card.classList.add('card');
            card.setAttribute('style', 'width: 18rem;');

            // Append card to grid
            postBody.appendChild(card);

            // create card body
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');    

            // append cardbody to card
            card.appendChild(cardBody);

            const title = document.createElement('h5');
            title.classList.add('card-title');
            title.innerText = postTitle;
            cardBody.appendChild(title);

            const desc = document.createElement('p');
            desc.classList.add('card-text');
            cardBody.appendChild(desc);
            desc.innerText = postDescription
            document.querySelector('#posts').appendChild(postBody);
        }

        function getPostList(postId, postTitle, elementId){
            const options = document.createElement('option');
            options.setAttribute('value', postId);
            options.innerText = postId+'. '+postTitle;

            document.getElementById(elementId).appendChild(options);

        }

        // XML HTTP Request
        function XHRequest(verb, endpoint, data){
            //initialize XML HTTP Request
            const xhr = new XMLHttpRequest();

            //get request data type
            xhr.responseType = 'json';

            // Manage respone
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    switch(verb){
                        case 'get':
                            xhr.response.map(el => {
                                //Get all post in document
                                postBody(el.title, el.description, el.id);

                                //Get Post List inside delete accrodion
                                getPostList(el.id, el.title, 'selectToDelete');
                                getPostList(el.id, el.title, 'selectToEdit');
                            });
                            break;
                    }
                }
                if (xhr.readyState === 4 && xhr.status === 201) { 
                    postBody(xhr.response.title, xhr.response.description, xhr.response.id);
                }
            }
            // Prepare request
            xhr.open(verb, endpoint, true);

            // send request
            switch(verb){
                case 'get': 
                    xhr.send();
                    break;
                case 'post':
                    xhr.setRequestHeader('Content-Type','application/json');
                    xhr.send(JSON.stringify(data));
                    break;
                case 'delete':
                    xhr.send();
                    break;
                case 'put':
                    xhr.setRequestHeader('Content-Type','application/json');
                    xhr.send(JSON.stringify(data));
                    break;
            }
        }

        //Create post
        document.getElementById('post').addEventListener('click', function(e){
            e.preventDefault();
            //get Form data
            const blogTitle = document.querySelector('#postTitle').value;
            const blogDesc = document.querySelector('#postDesc').value;

            // Prepare  data to send
            const data = {
                    "title": blogTitle,
                    "description": blogDesc
            };

            // sending request
            XHRequest('post', 'http://localhost:3000/posts', data);

            // make the form empty after post request
            document.querySelector('#postTitle').value = '';
            document.querySelector('#postDesc').value = '';
        });

        //Delete post


        document.getElementById('postDelete').addEventListener('click', function(e){
            e.preventDefault();

            // get selected option value
            const selectedPost = document.querySelector('#selectToDelete').value;

            // Send delete request
            XHRequest('delete', 'http://localhost:3000/posts/' + selectedPost);

            // remove post from grid and remove option tag from delete section
            document.querySelector('#postId' + selectedPost).remove();
            document.querySelector('#selectToDelete > option[value="' + selectedPost+'"]').remove();

        })

        // get selected post content
        document.querySelector('#selectToEdit').addEventListener('change', function(e){
            const id = e.target.value;
            
            const title = document.querySelector(`#postId${id} .card-title`).innerText;
            const content = document.querySelector(`#postId${id} .card-text`).innerText;

            document.getElementById('getPostId').value = id;
            document.getElementById('editTitle').value = title;
            document.getElementById('editDesc').innerText = content;
        })

        // Update post
        document.getElementById('postEdit').addEventListener('click', function(e){
            e.preventDefault();
      
            const title = document.getElementById('editTitle').value;
            const content = document.getElementById('editDesc').value;
            const postId = document.getElementById('getPostId').value;
        
            const data = {
                'title': title,
                'description': content
            }
            XHRequest('put', 'http://localhost:3000/posts/'+postId, data)

            document.querySelector(`#postId${postId} .card-title`).innerText = title;
            document.querySelector(`#postId${postId} .card-text`).innerText = content;
      
        });

        //Get post at the time of page loading
        function getPosts() {
            XHRequest('get', 'http://localhost:3000/posts');
        }
        window.onload = function(){
            getPosts();
        }

        