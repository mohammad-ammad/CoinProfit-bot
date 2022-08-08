let arr = localStorage.getItem('data') != undefined ? JSON.parse(localStorage.getItem('data')) : [];
const modelOpen = () => 
{
    let length = coinListSelector.options.length;
    for (i = length-1; i >= 0; i--) {
        coinListSelector.options[i] = null;
    }

    coinListSelector.innerHTML += '<option>Select Coin</option>';

    coinList.map((item) => (
        coinListSelector.innerHTML += '<option value="'+item+'">'+item+'</option>'
    ))
}

coinListSelector.addEventListener('change', (e) => {
    cprice.value = prices[e.target.value]
})

startMiner.addEventListener('submit', async (e) => {
    e.preventDefault();
    let coin = coinListSelector.value;
    let price = cprice.value;
    let day = days.value;

    const date = new Date();
    
    let obj = {
        'coin':coin,
        'price':price,
        'day':day,
        'miner_off_date':date.setDate(date.getDate() + Number(day))
    }

    localStorage.setItem('user',JSON.stringify(obj));
    localStorage.setItem('bot',true);

    let resp = await fetch('https://api.coincap.io/v2/assets');
    let res = await resp.json();

    if(res)
    {
        arr = [];
        res['data'].forEach(element => {
            if(element.name == coin)
            {
                arr.push(element)
            }
        });
    }

    localStorage.setItem('data',JSON.stringify(arr));

    activator()
//    sleep(1000);
//     terminal()
location.reload();
})

stop.addEventListener('click',()=>{
    localStorage.removeItem("user");
    localStorage.removeItem("data");
    localStorage.removeItem("bot");
    activator()
})

const terminal = async () => 
{
    console.log(obj)
    await sleep(3000);
    xterminal.innerHTML+='<p>> Bot Starting....</p>';
    await sleep(3000);
    xterminal.innerHTML+='<p>> Mining Coin ('+obj.coin+')</p>';
    await sleep(3000);
    xterminal.innerHTML+='<p>> Mining in process...</p>';
    await sleep(5000);
    xterminal.innerHTML+='<p>> Coin Price ('+obj.price+')</p>';
    await sleep(1000);
    xterminal.innerHTML+='<p>> Processing...</p>';
}

const miningLogic = async () => 
{
    let selectedCoin = obj.coin;

    let resp = await fetch('https://api.coincap.io/v2/assets');
    let res = await resp.json();

    if(localStorage.getItem('data') != undefined)
    {
        if(new Date().toLocaleString('en-GB',{timeZone:'UTC'}) != new Date(obj.miner_off_date).toLocaleString('en-GB',{timeZone:'UTC'}) && localStorage.getItem('bot'))
        {
            if(res)
            {
                res['data'].forEach(element => {
                    if(element.name == selectedCoin)
                    {
                        arr.push(element)
                    }
                });
            }

            localStorage.setItem('data',JSON.stringify(arr));
        }
    }
    else 
    {
        if(res)
        {
            res['data'].forEach(element => {
                if(element.name == selectedCoin)
                {
                    arr.push(element)
                }
            });
        }

        localStorage.setItem('data',JSON.stringify(arr));
    }
}

const iterate_able = async () => {
    let myarr = JSON.parse(localStorage.getItem('data'));

    myarr.map((item,index) => (
        iterate_result.innerHTML += '<tr>\
            <th scope="row">Day'+(index+1)+'</th>\
            <td>'+item.name+'</td>\
            <td>'+item.symbol+'</td>\
            <td>'+Number(item.priceUsd).toFixed(1)+'</td>\
            <td>'+Number(item.volumeUsd24Hr).toFixed(1)+'</td>\
            <td>'+Number(item.marketCapUsd).toFixed(1)+'</td>\
            <td>'+Number(item.maxSupply).toFixed(1)+'</td>\
          </tr>',
          priceDifference.push(item.priceUsd)
    ))

    let diff = Number(obj.price);
    let profit;
    priceDifference.forEach(element => {
        diff = Number(element) - diff;
    });

    diff > 0 ? profit = 'Gain' : profit = 'Loss';

    await sleep(16000);

    xterminal.innerHTML+='<p>> Price Difference: '+diff+'</p>';
    xterminal.innerHTML+='<p>> Profit: '+profit+'</p>';
    xterminal.innerHTML+='<p>> Processing....</p>';

    price_difference_td.innerHTML += 'Price Difference: '+diff;
    profit_td.innerHTML += 'Profit: '+profit;

}

setInterval(async function(){
    if(new Date().toLocaleString('en-GB',{timeZone:'UTC'}) != new Date(obj.miner_off_date).toLocaleString('en-GB',{timeZone:'UTC'}) && localStorage.getItem('bot'))
    {
        miningLogic()
    }
    else 
    {
        localStorage.setItem('bot',false);
        await sleep(1000);
        xterminal.innerHTML+='<p>> Time Up... exit(0)</p>';
    }
}, 1000*60*60*24);

terminal();
iterate_able();

