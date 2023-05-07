
import { getCookies, hasCookie, getCookie } from 'cookies-next';
import { pass } from '@utils/v1/crypt'
import moment from 'moment';

export function getDateNow() {
    return new Date().toISOString().slice(0, 10);
}
export function getDollar(money) {
    return money.toFixed(2);
}

export function getTimeNow(second = false) {
    if (second) {
        return new Date().toISOString().slice(11, 19);
    } else {
        return new Date().toISOString().slice(11, 16);
    }
}
export function zeroAdd(num, size = 5) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}
export function getRemainingDate(start, stop) {
    const date1 = new Date(start);
    const date2 = new Date(stop);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {
        time: diffTime,
        day: diffDays
    }
}

export function dateTest() {
    const startdate = systemTime()['date_system']
    var new_date = moment(startdate, "YYYY-MM-DD").add('days', 5);

    var day = new_date.format('DD');
    var month = new_date.format('MM');
    var year = new_date.format('YYYY');
    return false;
}
export function addDate(day) {
    const startdate = systemTime()['date_system']
    var new_date = moment(startdate, "YYYY-MM-DD").add('days', day);
    var day = new_date.format("YYYY-MM-DD");
    return day
}

export function systemTime() {
    let full = new Date().toLocaleString('en-SG', {
        timeZone: 'Asia/Singapore',
        hour12: false
    })
    let arr = full.split(' ')
    let date = arr[0].replace(',', '')
    let time = arr[1]
    let date_arr = date.split('/')
    let date_system = date_arr[2] + '-' + date_arr[1] + '-' + date_arr[0]
    let time_arr = time.split(':')
    let remaining_arr = {
        hour: 24 - time_arr[0],
        minute: 60 - time_arr[1],
        second: 60 - time_arr[2]
    }
    let remaining = remaining_arr.hour + ':' + remaining_arr.minute + ':' + remaining_arr.second
    let remaining_text = remaining_arr.hour + ' hour ' + remaining_arr.minute + ' minute ' + remaining_arr.second + ' second'
    let calc = {
        start: time.replace(':', '').replace(':', ''),
        stop: remaining.replace(':', '').replace(':', ''),
    }
    calc.final = ((calc.stop - calc.start) / calc.start) * 100
    return {
        full,
        date,
        time,
        date_system,
        time_arr,
        remaining,
        remaining_arr,
        calc,
        remaining_text,
        clock: time_arr[0] + ":" + time_arr[1]
    }
}

export function userControl(context = null) {
    if (hasCookie('admin_token', context)) {
        const domains = getCookie('admin_domains', context)
        const token = getCookie('admin_token', context)
        const tokenDecode = pass(token, false)
        if (tokenDecode == '45afbd9f05dd24dbf0b2a47d0806a20c590f00b60a88c1df2e02a1efe901fff0') {
            if (domains) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    } else {
        return false
    }
}
export function capitalize(str) {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}
export function convertDate(d) {
    const arr = d.split('T')
    const date_arr = arr[0].split('-')
    const date = date_arr[2] + '.' + date_arr[1] + '.' + date_arr[0]
    const time_arr = arr[1].split(':')
    const time = time_arr[0] + ':' + time_arr[1]
    return {
        date,
        time
    }
}
export function getPagination(page, size) {
    const limit = size ? +size : 3;
    const from = page ? page * limit : 0;
    const to = page ? from + size : size;

    return { from, to };
}
export function convertToSlug(Text) {
    return Text.toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
}
export function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return pattern.test(str);
}
export function URLify(string) {
    const urls = string.match(/((((ftp|https?):\/\/)|(w{3}\.))[\-\w@:%_\+.~#?,&\/\/=]+)/g);
    if (urls) {
        urls.forEach(function (url) {
            string = string.replace(url, '<a target="_blank" href="' + url + '">' + url + "</a>");
        });
    }
    return string.replace("(", "<br/>(");
}
export function getDomainRatesCalc(getRates, getAmount, string_status = false) {
    let amount = getAmount / 100 * getRates[0].rate
    let rate = getRates.length ? getRates[0].rate : 0
    getRates?.map((r, i) => {
        if (Number(r.min) <= Number(getAmount) && Number(r.max) >= Number(getAmount)) {
            rate = Number(r.rate)
            if (string_status == true) {
                amount = priceTrx(getAmount / 100 * rate)
            } else {
                amount = getPrice(getAmount / 100 * rate)
            }
        }
    })
    return {
        amount,
        rate
    }
}
export function getDomainRatesCalc6(getRates, getAmount, string_status = false) {
    let amount = getAmount / 100 * getRates[0].rate
    let rate = getRates.length ? getRates[0].rate : 0
    getRates?.map((r, i) => {
        if (Number(r.min) <= Number(getAmount) && Number(r.max) >= Number(getAmount)) {
            rate = Number(r.rate) + 6
            if (string_status == true) {
                amount = priceTrx(getAmount / 100 * rate)
            } else {
                amount = getPrice(getAmount / 100 * rate)
            }
        }
    })
    return {
        amount,
        rate
    }
}
export function priceTrx(price, status = true) {
    if (typeof price == "string") {
        price = Number(price.trim())
    }
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'TRX',
    });
    let result = formatter.format(price).replace('TRX', '');
    if (status) {
        return (result.trim()) + 'TRX'
    } else {
        return result.trim()
    }
}
export function swrOptions(component) {
    const data = {
        revalidateOnFocus: true,
        revalidateOnMount: true,
        revalidateOnReconnect: true,
        refreshWhenOffline: true,
        refreshWhenHidden: true,
        focusThrottleInterval: 0,


    }
    // if (component == "now") {
    //     // data.focusThrottleInterval = 0
    //     data.refreshInterval = 1000
    // }
    return data
}
export function getPrice(money) {
    let result = money
    if (typeof money == "string") {
        money = Number(money.trim())
    }
    if (money) {
        result = money.toFixed(2);
    } else {
        result = "0.00";
    }
    return Number(result.trim())

}
export function percent(data, percent) {
    return Number(data) / 100 * percent
}

export function linkEncode(data) {
    return encodeURIComponent(data)
}
export function qrLink(link) {
    if (link) {
        return "https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=" + linkEncode(link) + "&choe=UTF-8"
    } else {
        return "https://cdn11.bigcommerce.com/s-auu4kfi2d9/stencil/59606710-d544-0136-1d6e-61fd63e82e44/e/0894b830-8b48-013a-6456-3a45a8361dda/icons/icon-no-image.svg"
    }

}

export function getOpeningDate(date) {
    var d = new Date(date);
    var options = {
        month: 'long',
        day: 'numeric',
        // year: 'numeric'
    };
    return (d.toLocaleDateString('en-US', options));
}
export function convertDateReplace(d) {
    const date = d.split('-')
    return date[2] + '.' + date[1] + '.' + date[0];
}
// import {
//     useToast
// } from '@chakra-ui/react'
// export async function Alert(status, title, description) {
//     const toast = useToast();
//     toast({
//         title: "title",
//         description: "description",
//         status: "status",
//         duration: 9000,
//         isClosable: true,
//     });
// }

