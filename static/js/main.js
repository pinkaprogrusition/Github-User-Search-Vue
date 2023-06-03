let application = new Vue({
    el: "#app",
    data: {
        showLoader: false,
        queryParams:{
            username: "",
            sortBy: "desc",
            page: 1,

            needReload: true,
            isError: false,
            canLoad: true
        },
        users: []
    },
    methods: {
        onEnterKeyPressed(){
            this.onQueryParamsChange()
            this.getAllUsers()
        },
        onScroll ({ target: { scrollTop, clientHeight, scrollHeight }}) {
            if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
                this.queryParams.page ++;
                if(!this.showLoader) this.getAllUsers(this.queryParams.page)
            }
        },
        onQueryParamsChange(){
            this.queryParams.isError = false
            this.queryParams.canLoad = true
            this.queryParams.needReload = true
        },
        switchSortOrderType(){
            this.onQueryParamsChange()
            this.queryParams.sortBy = this.queryParams.sortBy == "desc" ? "asc" : "desc";
            this.getAllUsers()
        },
        getAllUsers(page = 1){
            console.log(this.queryParams.needReload)
            
            if(this.queryParams.isError) return;
            if(this.queryParams.username.trim() == "") return
            
            if(this.queryParams.needReload){
                this.users = []
                this.queryParams.page = 1
            }

            const t = this;
            this.showLoader = true
            let xhr = new XMLHttpRequest();
            xhr.open('GET', `https://api.github.com/search/users?q=${this.queryParams.username}&sort=repositories&order=${this.queryParams.sortBy}&per_page=100&page=${this.queryParams.page}`);
            xhr.send();
    
            xhr.onload = function() {
            if (xhr.status != 200) {
                console.log(`Error: ${xhr.status}: ${xhr.statusText} : ${xhr.response}`); 
                
                if(xhr.status == 422) t.queryParams.canLoad = false
                
                t.showLoader = false;
                t.queryParams.isError = true;
            } else {
                try{
                    let message = JSON.parse(xhr.response)
                    t.users = [
                        ...t.users,
                        ...message.items
                    ]
                    t.queryParams.needReload = false
                    t.showLoader = false
                }
                catch(err){
                    console.log(err)
                    t.showLoader = false
                    t.queryParams.isError = true
                }
            }
        };
            xhr.onerror = () => {
                console.log("Failed to load");
                t.queryParams.isError = true
                t.showLoader = false
            }
        },
    },
    created(){
        this.getAllUsers()
    }
})