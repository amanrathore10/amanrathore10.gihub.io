
import './../css/styles.css';
import addimage from '../images/plus-button.png' ;
var baseUrl = 'https://api.themoviedb.org/3/';
var api_key = '733e4c5273cb35e596bcb84936a79b5d';
var imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
var searchTimeout;

var myMovies = [];
if(localStorage.getItem('myMovies')!==undefined&&localStorage.getItem('myMovies')!==null){
    myMovies = JSON.parse(localStorage.getItem('myMovies'));

}
var newMovie = {};
var filter = null;
var modal = document.getElementsByClassName('modal')[0];
var modalContainer = document.getElementsByClassName('modal-container')[0];
var radios = document.getElementsByName("movie-filter");
var movieName = document.getElementById('movie-name');
var movieYear = document.getElementById('movie-year');
window.onload = function(){
    homeScreen();
    
}

var inputSearch = document.getElementById('movie-search');
inputSearch.addEventListener('keyup',function(event){
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(function(){
        if(event.target.value===''){
            homeScreen();
        }else{
            searchMovies(baseUrl,event.target.value,filter);
        }
        
    },1000);
}); 



for(var i=0;i<radios.length;i++){
    radios[i].addEventListener('click',function(e){
        var j= 0;   
        
        while(j<radios.length){
            if(radios[j].checked===true){
                console.log(radios[j].checked,radios[j].value);
                document.getElementById('choosen-filter').innerHTML = radios[j].value;
                filter = radios[j].value;
                homeScreen();
                break;
            }
            j++;
        }
        
    });
}

document.getElementById('movie-form').addEventListener('submit',function(e){
    e.preventDefault();
    if(movieName.value.length>0){
        newMovie.title= movieName.value;
    newMovie.year = movieYear.value;
    myMovies.push(newMovie);
    localStorage.setItem('myMovies',JSON.stringify(myMovies));
     movieName.value='';
     movieYear.value = '';
    this.reset();
    modalContainer.style.display='none';
    document.body.style.overflow='auto'
    }
});

document.getElementById("movie-img").addEventListener('change' , function (e) {
    var reader = new FileReader();
    reader.onload = function (e) {
        // get loaded data and render preview image.
        document.getElementById("preview-image").src = e.target.result;
        var movieimg = e.target.result;
        newMovie.imageUrl = movieimg;
        
    };
    // read the image file as a data URL.
    reader.readAsDataURL(this.files[0]);
});

document.getElementById('mymovietab').addEventListener('click',function(e){
    document.getElementsByClassName('movietab')[1].classList.remove('active-tab');
    document.getElementsByClassName('movietab')[0].classList.remove('active-tab');
    this.classList.add('active-tab');

    var temp = myMovies.map(function(result,index){
        return '<div class="movie slideup"><div class="movie-image"><div class="delete-movie-button"><button>DELETE</button></div><img src="'+(result.imageUrl||'./image/movie-image-fallback')+'"/></div><div class="movie-title">'+(result.title)+'<span class="movie-release_date">'+result.year+'</span></div></div>'
    }).join('');
    if(myMovies.length!==0){
        document.getElementById('movie-container').innerHTML = temp;
    }
    else{
        document.getElementById('movie-container').innerHTML = "<div><div>No Movie in your library</div></div>";
    } 
    deleteMovieListener();
    
});
document.getElementById('homemovietab').addEventListener('click',function(e){
    document.getElementsByClassName('movietab')[1].classList.remove('active-tab');
    document.getElementsByClassName('movietab')[0].classList.remove('active-tab');
    this.classList.add('active-tab');
    homeScreen();
});


modalContainer.addEventListener('click',function(e){
    if(event.target.contains(modal)){
        modalContainer.style.display = "none";
        document.body.styleoverflow = 'auto';
    }
});


document.getElementById('menu-icon').addEventListener('click',function(e){
        document.getElementsByClassName('nav')[0].classList.toggle('show-nav');
});

function addMovieListener(){
    var movies = document.getElementsByClassName('movie');
        for(var k=0;k<movies.length;k++){
            movies[k].addEventListener('click',function(e){
            if(!e.target.contains(this.childNodes[0].children[0])){
                // console.log(this.childNodes,this.children);
                newMovie = {};
                newMovie.title = this.childNodes[1].innerHTML.split("<")[0];
                newMovie.year = this.childNodes[1].children[0].innerText;
                newMovie.imageUrl = this.childNodes[0].children[1].src;
                // console.log(newMovie);
                // console.log(myMovies,newMovie);
                var newMovies = myMovies;
                if(newMovies.filter(myMovie=>myMovie.title===newMovie.title).length===0){
                    myMovies.push(newMovie);
                    localStorage.setItem('myMovies',JSON.stringify(myMovies));
                }else{
                    newMovie = {};
                }
            }
        });
    };
};
function deleteMovieListener(){
    var movies = document.querySelectorAll('.movie');
        for(var k=0;k<movies.length;k++){
            movies[k].addEventListener('click',function(e){
            if(!e.target.contains(this.childNodes[0].children[0])){
                console.log(this.childNodes,this.children);
                newMovie = {};
                newMovie.title = this.childNodes[1].innerHTML.split("<")[0];
                newMovie.year = this.childNodes[1].children[0].innerText;
                newMovie.imageUrl = this.childNodes[0].children[1].src;
                // console.log(newMovie,myMovies.indexOf(newMovie));
                
                myMovies = myMovies.filter(movie=>movie.title!==newMovie.title);
                console.log(myMovies,newMovie);
                localStorage.setItem('myMovies',JSON.stringify(myMovies));
                renderMyMovies();
                deleteMovieListener();
            }
        });
    };
};
function renderMyMovies(){
    var temp = myMovies.map(function(result,index){
        return '<div class="movie slideup"><div class="movie-image"><div class="delete-movie-button"><button>DELETE</button></div><img src="'+(result.imageUrl||'./image/movie-image-fallback')+'"/></div><div class="movie-title">'+(result.title)+'<span class="movie-release_date">'+result.year+'</span></div></div>'
    }).join('');
    if(myMovies.length!==0){
        document.getElementById('movie-container').innerHTML = temp;
    }
    else{
        document.getElementById('movie-container').innerHTML = "<div><div>No Movie in your library</div></div>";
    } 
}
function homeScreen(){
    fetch(baseUrl+'trending/all/day?api_key='+api_key).then(res=>res.json())
    .then(function(data){
         data.results = dataFilter(data.results,filter);
         console.log(data);
        var temp = data.results.map(function(result,index){
            var imageUrl = imageBaseUrl+(result.backdrop_path||result.poster_path);
            var year = new Date(result.release_date||result.first_air_date);
            year = year.getFullYear();
            return '<div class="movie slideup"><div class="movie-image"><div class="add-movie-button"><button>ADD</button></div><img src="'+imageUrl+'"/></div><div class="movie-title" title="'+(result.original_name||result.original_title)+'">'+(result.original_name||result.original_title)+'<span class="movie-release_date">'+year+'</span></div></div>'
        }).join('');

        document.getElementById('movie-container').innerHTML = '<div class="movie addmovie"><div class="movie-image" ><img style="object-fit:contain;background:#fff" src="'+addimage+'" alt="add new movie"></div><div class="movie-title" style="text-align:center;font-weight:500;letter-spacing:1px;">ADD NEW MOVIE</div></div>'+temp;
        document.getElementsByClassName('addmovie')[0].addEventListener('click',function(e){
            modalContainer.style.display = "block";
            document.body.style.overflow = 'hidden';
        });
        addMovieListener();
    });
}

function searchMovies(baseUrl,query,filter){
    fetch(baseUrl+'search/movie?api_key='+api_key+'&query='+query).then(res=>res.json())
    .then(function(data){
        data.results = dataFilter(data.results,filter);
        var temp = data.results.map(function(result,index){
            var imageUrl = (result.backdrop_path||result.poster_path)?(imageBaseUrl+(result.backdrop_path||result.poster_path)):'./images/movie-image-fallback.jpg';
            var year = new Date(result.release_date||result.first_air_date);
            year = year?year.getFullYear():'';
            return '<div class="movie slideup"><div class="movie-image"><div class="add-movie-button"><button>ADD</button></div><img src="'+imageUrl+'"/></div><div class="movie-title">'+(result.original_name||result.original_title)+'<span class="movie-release_date">'+(year?year:"")+'</span></div></div>'
        }).join('');
        if(data.results.length!==0){
            document.getElementById('movie-container').innerHTML = temp;
        }
        else{
            document.getElementById('movie-container').innerHTML = "<div>No results for this search</div>";
        }
        addMovieListener();
    });
}
function dataFilter(results,filter){
    if(filter==='title'){
        return results.sort(function(a,b){
            var title1 = (a.original_name||a.original_title)||'';
            var title2 = (b.original_name||b.original_title)||'0';
            console.log(title1,title2);
            if(title1>title2){
                return 1;
            }
            else{
                return -1;
            }});
    }
    if(filter==='year')
    return results.sort(function(a,b){
        var year1 = (new Date((a.release_date||a.first_air_date)).getFullYear()||0);
        var year2 = (new Date((b.release_date||b.first_air_date)).getFullYear()||0);
        console.log(year1,year2);
        return(year1-year2)});
    if(filter===null){
        return results;
    }
}
