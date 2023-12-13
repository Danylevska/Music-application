class App {
    static API_KEY = "356f4387d0mshb630369e5ed26c2p15ddc1jsn63e90ad403d2";
    static SEARCH_URL = "https://deezerdevs-deezer.p.rapidapi.com/search?q=";
    static DEFAULT_HEADERS = {
        "X-RapidAPI-Key": App.API_KEY,
        "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
    };

    static searchButton = document.querySelector("#searchButton");
    static input = document.querySelector("input");
    static output = document.querySelector("#output");

    static savedPlaylist = document.querySelector("#savedPlaylist");
    static toSavePlaylistButton = document.querySelector("#toSavePlaylistButton");
    static sortByRating = document.querySelector("#sortByRating");



    static SECTIONS = {
        main: "main",
        playlistsection: "playlistsection",
    };

    constructor(data = [], watchList = []) {
        this.data = data;
        this.watchList = watchList;
        this.currentSection = App.SECTIONS.main;

     
        App.searchButton.onclick = () => this.onButtonClick();
        App.toSavePlaylistButton.onclick = () => this.currentSection === App.SECTIONS.main ? this.renderSavedPlayList() : this.renderMainView();
        App.sortByRating.onclick = () => this.sortByRating()
    }



    onButtonClick() {
   
        this.getDataBySearch(App.input.value).then(() => {
            App.input.value = "";
          

            this.renderData(this.data, App.output);

        })

    }

    async getDataBySearch(trackName = "") {
        try {
            const response = await fetch(App.SEARCH_URL + trackName, { headers: App.DEFAULT_HEADERS });
            const data = await response.json();

            this.data = data.data ? data.data : [];

        } catch (e) {
            alert("Query is not found");
          

        }
    }

    getPlaylistData() {

        return JSON.parse(localStorage.getItem("playlist") || "[]");

    }

    saveplaylistData(track) {
        const oldPlaylist = this.getPlaylistData();
        localStorage.setItem("playlist", JSON.stringify([...oldPlaylist, track]));

    }

    deletePlaylistData(id) {
        const oldPlaylist = this.getPlaylistData();
        localStorage.setItem("playlist", JSON.stringify([...oldPlaylist].filter((track) => track.id !== id)));

    }

    checkIfPlaylistContainsTrack(id) {
        return this.getPlaylistData().find((track) => track.id === id) ? true : false;

    }

    renderData(dataToRender, outputElement = App.output, isUsingAsPlaylist = false) {
        outputElement.innerHTML = "";
        dataToRender.forEach((track) => {
            const { id,
                title,
                rank,
                artist,
                album,
                preview,
            } = track;

            const isTrackSavedToPlaylist = this.checkIfPlaylistContainsTrack(id)

            const audio = document.querySelector("audio");


            outputElement.innerHTML += `
<div class="track-elem">
<div class="pictureInfoWrapper">
<img class="artist-image" src="${album.cover_medium}"/>
<div class="Info">
<h4>${title}</h4>
<p>Rating: ${rank}</p>
<p>Artist: ${artist.name}</p>  
<p>Album: ${album.title === "?" ? album.title = "Unknown" : album.title}</p>
</div>
</div>
<audio src="${preview}" controls></audio>
<button id="btn-${id}" class="saveButton ${isTrackSavedToPlaylist ? "playlist-track" : "main-track"
}">${isTrackSavedToPlaylist ? "Delete from playlist" : "Save to playlist"}</button>



</div>
`;


        });




        const saveButton =
            this.currentSection === App.SECTIONS.main
                ? App.output.querySelectorAll(".saveButton")
                : App.savedPlaylist.querySelectorAll(".saveButton");

        [...saveButton].forEach((btn, i) => {
            btn.onclick = () => {
                const currentTrack = dataToRender[i];

                if (this.checkIfPlaylistContainsTrack(currentTrack.id)) {
                    this.deletePlaylistData(currentTrack.id);

                    if (isUsingAsPlaylist) {
                        this.renderData(this.getPlaylistData(), App.savedPlaylist, true);
                    }

                    btn.textContent = "Save to playlist";
                    btn.style.border = "1px solid #8585e9";




                    const buttonFromMain = App.output.querySelector(`#${btn.id}`);
                    const buttonFromSavedPlaylist = App.savedPlaylist.querySelector(`#${btn.id}`);

                    if (buttonFromMain)
                        buttonFromMain.textContent = "Save to playlist";




                    if (buttonFromSavedPlaylist)
                        buttonFromSavedPlaylist.textContent = "Save to playlist";





                } else {
                    this.saveplaylistData(currentTrack);

                    btn.textContent = "Delele from playlist";
                    btn.style.border = "1px solid #e0af47";





                    const buttonFromMain = App.output.querySelector(`#${btn.id}`);
                    const buttonFromSavedPlaylist = App.savedPlaylist.querySelector(`#${btn.id}`);

                    if (buttonFromMain)
                        buttonFromMain.textContent = "Delele from playlist";
                    buttonFromMain.style.border = "1px solid #e0af47";





                    if (buttonFromSavedPlaylist)
                        buttonFromSavedPlaylist.textContent = "Delele from playlist";




                }
            };

        });


    }


    renderSavedPlayList() {
        App.output.style.display = "none";
        App.savedPlaylist.style.display = "flex";
        App.savedPlaylist.style.paddingBottom = "500px";
        App.toSavePlaylistButton.textContent = "Main page";

        this.currentSection = App.SECTIONS.playlistsection;

        const playlistData = this.getPlaylistData();

        this.renderData(playlistData, App.savedPlaylist, true);

    }

    renderMainView() {
        App.output.style.display = "flex";
        App.savedPlaylist.style.display = "none";
        App.output.style.backgroundColor = "#030418";

        this.currentSection = App.SECTIONS.main;


        App.toSavePlaylistButton.textContent = "Saved playlist";

        this.currentSection = App.SECTIONS.main;


    }

    sortByRating() {
        if (this.currentSection = App.SECTIONS.main) {
            const tracksToSortMainPlaylist = this.data;
            tracksToSortMainPlaylist.sort((track1, track2) => Number(track2.rank) - Number(track1.rank))


            this.renderData(tracksToSortMainPlaylist, App.output);
        }

        if (this.currentSection = App.SECTIONS.playlistsection) {

            const tracksToSortSavedPlayList = this.getPlaylistData();

            tracksToSortSavedPlayList.sort((track1, track2) => Number(track2.rank) - Number(track1.rank))


            this.renderData(tracksToSortSavedPlayList, App.savedPlaylist);
        }
    }




}

new App();