var beatpack = [
	{
		name: "2Stroke",
		artist: "Bones - Prod. Niq Venus",
		src: "./samples/radio/classical.mp3",
		thumbnail: "url(https://images.pexels.com/photos/1255149/pexels-photo-1255149.jpeg)"
	},
	{
		name: 'Playboi Carti type beat "Jaded"',
		artist: "Niq Venus",
		src: "./samples/radio/dance.mp3",
		thumbnail: "url(https://images.pexels.com/photos/4487521/pexels-photo-4487521.jpeg)"
	},
	{
		name: 'Roddy Ricch type beat "HERO"',
		artist: "Niq Venus",
		src: "./samples/radio/jazz.mp3",
		thumbnail: "url(https://images.pexels.com/photos/4337198/pexels-photo-4337198.jpeg)"
	},
	{
		name: "Reeses Puffs",
		artist: "Niq Venus",
		src: "./samples/radio/rock.mp3",
		thumbnail: "url(https://images.pexels.com/photos/2894944/pexels-photo-2894944.jpeg)"
	}
];

$(document).ready(function () {
	var playing = false,
		artistname = $(".artist-name"),
		musicName = $(".music-name"),
		time = $(".time"),
		fillBar = $(".fillBar");

	var song = new Audio();
	var CurrentSong = 0;
	window.onload = load();

	function load() {
		artistname.html(beatpack[CurrentSong].name);
		musicName.html(beatpack[CurrentSong].artist);
		song.src = beatpack[CurrentSong].src;
	}

	function playSong() {
		song.src = beatpack[CurrentSong].src;
		song.play();
		$("#thumbnail").css("background-image", beatpack[CurrentSong].thumbnail);
		$("#play").addClass("fa-pause-circle");
		$("#play").removeClass("fa-play-circle");
		$("#thumbnail").addClass("active");
		$(".player-track").addClass("active");
	}

	$("#play").click(function playOrPause() {
		if (song.paused) {
			song.play();
			playing = true;
			$("#play").addClass("fa-pause-circle");
			$("#play").removeClass("fa-play-circle");
			$("#thumbnail").addClass("active");
			$(".play-btn:before").css("padding-left", 300);

			document.getElementsByClassName("play-btn")[0].classList.add("pause-btn");
			document.getElementsByClassName("play-btn")[0].classList.remove("play-btn");
		} else {
			song.pause();
			playing = false;
			$("#play").removeClass("fa-pause-circle");
			$("#play").addClass("fa-play-circle");
			$("#thumbnail").removeClass("active");

			document.getElementsByClassName("pause-btn")[0].classList.add("play-btn");
			document
				.getElementsByClassName("pause-btn")[0]
				.classList.remove("pause-btn");
		}
	});

	$("#prev").click(function prev() {
		CurrentSong--;
		if (CurrentSong < 0) {
			CurrentSong = beatpack.length - 1;
		}
		playSong();
	});

	$("#next").click(function next() {
		CurrentSong++;
		if (CurrentSong == beatpack.length) {
			CurrentSong = 0;
		}
		playSong();
	});
});