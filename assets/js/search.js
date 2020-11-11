document.addEventListener("DOMContentLoaded", function () {

    // getting all required elements
    const searchWrapper = document.querySelector(".search-input");
    const inputBox = searchWrapper.querySelector("input");
    const suggBox = searchWrapper.querySelector(".autocom-box");
    const icon = searchWrapper.querySelector(".icon");
    let linkTag = searchWrapper.querySelector("a");
    let webLink;

    function showSuggestions(list) {
        let listData;
        if (!list.length) {
            userValue = inputBox.value;
            listData = '<li>' + userValue + '</li>';
        } else {
            listData = list.join('');
        }
        suggBox.innerHTML = listData;
    }

    inputBox.value = "";

    axios.get("/search")
        .then(function (result) {
            const searchContent = result.data;
            const searchIndex = lunr(function () {
                this.use(lunr.multiLanguage('en', 'ru'))
                this.ref("id")
                this.field("content");
                this.field("tag");
                this.field("title");
                this.field("url");

                Array.from(result.data).forEach(function (doc) {
                    this.add(doc)
                }, this)
            });
            // if user press any key and release
            inputBox.onkeyup = (e) => {
                searchWrapper.scrollIntoView();
                let userData = e.target.value; //user enetered data
                let emptyArray = [];
                if (userData) {
                    try {
                        emptyArray = searchIndex.search(userData);
                    } catch (err) {
                        if (err instanceof lunr.QueryParseError) {
                            return;
                        }
                    }
                    emptyArray = emptyArray.map(data => {
                        let item = searchContent.find(function (e) {
                            return e.id == parseInt(data.ref);
                        });
                        // passing return data inside li tag
                        return '<li onclick="window.location.href=\'' + item.url + '\';">' + item.title + '</li>';
                    });
                    searchWrapper.classList.add("active"); //show autocomplete box
                    showSuggestions(emptyArray);
                } else {
                    searchWrapper.classList.remove("active"); //hide autocomplete box
                }
            }
        })
        .catch(function (error) {
            console.error(error);
        });
});