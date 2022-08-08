let tableBodyOne = document.querySelector("#table_body_one");
let pagination_ul = document.querySelector("#pagination_ul");
let coinListSelector = document.getElementById('coinListSelector');
let startMiner = document.querySelector("#startMiner");
let cprice = document.getElementById('cprice');
let days = document.getElementById('days');
let stop = document.getElementById('stop');
let run = document.getElementById('run');
let bot_container = document.getElementById('bot_container');
let coin_heading = document.getElementById('coin_heading');
let duration_heading = document.getElementById('duration_heading');
let xterminal = document.getElementById('terminal');
let iterate_result = document.getElementById('iterate_result');
let price_difference_td = document.getElementById('price_difference_td');
let profit_td = document.getElementById('profit_td');
let pSize = 10, pNumber = 1;
let pageLength;
let data;
let coinList = [];
let prices = {};
let storage = [];
let obj = JSON.parse(localStorage.getItem('user'));
let priceDifference = [];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const activator = async () => {
    localStorage.getItem('user') != undefined ? stop.style.display = 'block' : stop.style.display = 'none';
    localStorage.getItem('user') != undefined ? run.style.display = 'none' : run.style.display = 'block';
    localStorage.getItem('user') != undefined ? bot_container.style.display = 'block' : bot_container.style.display = 'none';
    localStorage.getItem('user') != undefined ? coin_heading.innerHTML = obj.coin : '';
    localStorage.getItem('user') != undefined ? duration_heading.innerHTML = 'Duration:'+new Date(obj.miner_off_date).toLocaleString('en-GB',{timeZone:'UTC'}) : '';
}

const fetchData = async () => 
{
    activator()
    let response = await fetch('https://api.coincap.io/v2/assets');
    data = await response.json();
    pageLength = data['data'].length/pSize;
    paginationNav()
    appendData()

    data['data'].map((item)=>(coinList.push(item.name), prices[item.name]=item.priceUsd))

}

const appendData = () => 
{
    if(data['data'])
    {
        tableBodyOne.innerHTML += '';
        paginate(data['data'], pSize, pNumber).map((item,index)=>(
            tableBodyOne.innerHTML += '<tr>\
            <th scope="row">'+(index+1)+'</th>\
            <td>'+item.name+'</td>\
            <td>'+item.symbol+'</td>\
            <td>'+Number(item.priceUsd).toFixed(1)+'</td>\
            <td>'+Number(item.volumeUsd24Hr).toFixed(1)+'</td>\
            <td>'+Number(item.marketCapUsd).toFixed(1)+'</td>\
            <td>'+Number(item.maxSupply).toFixed(1)+'</td>\
            <td>-</td>\
            <td>-</td>\
          </tr>'
        ))
    }
}
const paginationNav = () => 
{
    pagination_ul.innerHTML += '<li class="page-item disabled">\
    <a class="page-link">Previous</a>\
  </li>';
    for (let index = 1; index <= pageLength; index++) {
        pagination_ul.innerHTML += '<li class="page-item"><a class="page-link" href="javaScript:void(0)" onclick="pageClick('+index+')">'+index+'</a></li>';
    }

    pagination_ul.innerHTML += '<li class="page-item disabled">\
    <a class="page-link" href="javaScript:void(0)">Next</a>\
  </li>';
}

const pageClick = (page) => 
{
    pNumber = page;
    var rowCount = tableBodyOne.rows.length;
    for (var i = 1; i <= rowCount; i++) {
        tableBodyOne.deleteRow(0);
    }
    appendData();
} 

const paginate = (array, pageSize, pageNumber) => {
    return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}


fetchData();
