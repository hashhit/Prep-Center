
import axios from "axios"
import moment from "moment"
import Noty from "Noty"



export function initAdmin(socket) {
    const orderTableBody = document.querySelector('#orderTableBody')
    let placements = []
    let markup

    axios.get('/admin/placements', {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    }).then(res => {
        placements = res.data
        markup = generateMarkup(placements)
        orderTableBody.innerHTML = markup
    }).catch(err => {
        console.log(err)
    })

    function renderItems(items) {
        let parsedItems = Object.values(items)
        return parsedItems.map((orderItem) => {
            return `
                <p>${orderItem.item.name} - ${orderItem.qty} pcs </p>
            `
        }).join('')
    }

    function generateMarkup(placements) {
        return placements.map(placement => {
            return `
                <tr>
                <td class="border px-4 py-2 text-green-900">
                    <p>${placement._id}</p>
                    <div>${renderItems(placement.items)}</div>
                </td>
                <td class="border px-4 py-2">${placement.customerId.name}</td>
                <td class="border px-4 py-2">${placement.address}</td>
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-64">
                        <form action="/admin/order/status" method="POST">
                            <input type="hidden" name="orderId" value="${placement._id}">
                            <select name="status" onchange="this.form.submit()"
                                class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded     
                                shadow leading-tight focus:outline-none focus:shadow-outline">
                                <option value="placed"
                                    ${placement.status === 'placed' ? 'selected' : ''}>
                                    Placed</option>
                                <option value="confirmed" ${placement.status === 'confirmed' ? 'selected' : ''}>
                                    Confirmed</option>
                                <option value="labelled" ${placement.status === 'labelled' ? 'selected' : ''}>
                                    Labelled</option>
                                <option value="sticker_removed" ${placement.status === 'sticker_removed' ? 'selected' : ''}>
                                    Sticker Removed
                                </option>
                                <option value="expiration_labelled" ${placement.status === 'expiration_labelled' ? 'selected' : ''}>
                                    Expiration Labelled
                                </option>
                                <option value="completed" ${placement.status === 'completed' ? 'selected' : ''}>
                                    Completed
                                </option>
                                <option value="shipping_to_courier_service" ${placement.status === 'shipping_to_courier_service' ? 'selected' : ''}>
                                    Shipped to courier service
                                </option>
                                <option value="delivered" ${placement.status === 'delivered' ? 'selected' : ''}>
                                    Delivered
                                </option>

                            </select>
                        </form>
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20">
                                <path
                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </td>
                <td class="border px-4 py-2">
                    ${moment(placement.createdAt).format('hh:mm A')}
                </td>
            </tr>
        `
        }).join('')


    }
    //Socket
    // let socket = io('http://localhost:3000/')

    socket.on('orderPlaced', (order) => {
        new Noty({
            type: 'info',
            timeout: 600,
            text: 'New Order',
            progressBar: false
        }).show();
        placements.unshift(order)
        orderTableBody.innerHTML = ''
        orderTableBody.innerHTML = generateMarkup(placements)
    })
}

// module.exports = initAdmin
