let application = new Vue({
    el: "#app",
    data: {
        showLoader: false,
        canLoad: true,
        isError: false,
        
        repos: [],
        user: {
            name: "",
            avatarURL: "",
            reposURL: "",
            githubURL: ""
        }
    },
    methods: {
        getUserInfo(){
            const t = this;
            this.showLoader = true

            let xhr = new XMLHttpRequest();
            xhr.open('GET', `https://api.github.com/users/${this.user.name}`);
            xhr.send();
    
            xhr.onload = function() {
                if (xhr.status != 200) {
                    console.log(`Error: ${xhr.status}: ${xhr.statusText} : ${xhr.response}`); 
            
                    t.showLoader = false;
                    t.isError = true;
                } else {
                    try{
                        let message = JSON.parse(xhr.response)

                        t.user.avatarURL = message.avatar_url
                        t.user.reposURL = message.repos_url
                        t.user.githubURL = message.html_url

                        t.getUserRepos()
                    }
                    catch(err){
                        console.log(err)
                        t.showLoader = false
                        t.isError = true
                    }
                }
            };
    
            xhr.onerror = () => {
                console.log("Failed to load");
                t.isError = true
                t.showLoader = false
            }
        },
        getUserRepos(){
            const t = this;
            this.showLoader = true
            let xhr = new XMLHttpRequest();
            xhr.open('GET', `https://api.github.com/users/${this.user.name}/repos`);
            xhr.send();
    
            xhr.onload = function() {
                if (xhr.status != 200) {
                    console.log(`Error: ${xhr.status}: ${xhr.statusText} : ${xhr.response}`); 
                    t.showLoader = false;
                    t.isError = true;
                } else {
                    try{
                        let message = JSON.parse(xhr.response)
                        t.repos = message
                        t.showLoader = false
                    }
                    catch(err){
                        console.log(err)
                        t.showLoader = false
                        t.isError = true
                    }
                }
            };
    
            xhr.onerror = () => {
                console.log("Failed to load");
                t.isError = true
                t.showLoader = false
            }
        }
    },
    created(){
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        this.user.name = urlParams.get('username')
        
        this.getUserInfo()
    }
})