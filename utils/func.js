
export function phoneHidden(phone) {
    let phoneTotal = phone.length
    return `${phone.slice(0, 3)}***${phone.slice(6)}`;
    // if (phone) {
    //     let phoneTotal = phone.length
    //     phone = phone.slice(-3)
    //     for (let i = 0; i <= (phoneTotal - 3); i++) {
    //         phone = phone + '*'
    //     }
    //     return phone
    // } else {
    //     return '**'
    // }
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
        remaining_text
    }
}

export function swrOptions(component) {
    const data = {
        // revalidateOnFocus: true,
        // revalidateOnMount: true,
        // revalidateOnReconnect: true,
        // refreshWhenOffline: false,
        // refreshWhenHidden: false,
        // focusThrottleInterval: 20000
        refreshInterval: 120000
    }
    if (component == "now") {
        // data.focusThrottleInterval = 0
        data.refreshInterval = 10000
    }
    return data
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
        return result.trim().replace(",", "")
    }
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
export function capitalize(str) {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

export function getDateNow() {
    return new Date().toISOString().slice(0, 10);
}
export function convertDateReplace(d) {
    const date = d.split('-')
    return date[2] + '.' + date[1] + '.' + date[0];
}
export function convertDate(d) {
    const arr = d.split('T')
    const date_arr = arr[0].split('-')
    const date = date_arr[0] + '.' + date_arr[1] + '.' + date_arr[2]
    const time_arr = arr[1].split(':')
    const time = time_arr[0] + ':' + time_arr[1]
    return {
        date,
        time
    }
}