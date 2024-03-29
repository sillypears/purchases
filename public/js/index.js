$(function () {
    console.log("Hi pal. Hope your day is going nicely. Or night. You've picked a wild adventure trying to set this up.")
    console.log(`           ████
             ██                    
             ████                  
               ██                  
               ▒▒▒▒▒▒              
             ▒▒▒▒▒▒▒▒▒▒            
           ▒▒▒▒▒▒▒▒▒▒▒▒            
           ▒▒▒▒▒▒▒▒▒▒▒▒▒▒          
           ▒▒▒▒▒▒▒▒▒▒▒▒▒▒          
           ▒▒▒▒▒▒▒▒▒▒▒▒▒▒          
           ▒▒▒▒▒▒▒▒▒▒▒▒▒▒          
           ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒        
           ▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒▒▒      
         ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒    
         ▒▒▒▒▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒▒▒▒▒  
       ▒▒▒▒▒▒▒▒▒▒▒▒  ▒▒▒▒  ▒▒▒▒▒▒  
       ▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒      ▒▒▒▒▒▒
     ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  ▒▒  ▒▒  ▒▒▒▒
     ▒▒▒▒▒▒▒▒▒▒▒▒  ▒▒▒▒  ▒▒  ▒▒▒▒▒▒
     ▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒  ▒▒      ▒▒▒▒
     ▒▒▒▒▒▒▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒  ▒▒▒▒▒▒
     ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒▒▒▒▒
       ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  
         ▒▒▒▒▒▒▒▒▒▒████▒▒▒▒▒▒▒▒    
           ▒▒▒▒▒▒▒▒██▒▒▒▒▒▒ `)
    $('.toggle-icon').on('click', function () {
        console.log(this.dataset.id)
        $.ajax({
            'url': `/api/receiveToggle/${this.dataset.id}`,
            'type': 'GET',
            'success': function (result) {
                if (result.message == 1) {
                    $(`#card-${result.purchaseId}`).addClass('green')
                    $(`#card-${result.purchaseId}`).removeClass('red')
                } else {
                    $(`#card-${result.purchaseId}`).addClass('red')
                    $(`#card-${result.purchaseId}`).removeClass('green')

                }
            }
        });
    })
    $.ajax({
        'url': '/api/picRefreshStatus',
        'type': 'GET',
        'success': function (result) {
            console.log(result.message)
            if (result.message) {
                $('#picRefresh').addClass('disabled');
            } else {
                $('#picRefresh').removeClass('disabled');
            }
        }
    })
    setInterval(function () {
        $.ajax({
            'url': '/api/picRefreshStatus',
            'type': 'GET',
            'success': function (result) {
                console.log(result.message)
                if (result.message) {
                    $('#picRefresh').addClass('disabled');
                } else {
                    $('#picRefresh').removeClass('disabled');
                }
            }
        })
    }, 5000)
    $('.sculpt').on('click', function () {
        console.log(this.textContent)
    })
    $('.archivist').on('click', function () {
        console.log(this.textContent)
    })
    $('.will-sell').on('click', function () {
        console.log(this.dataset.id, this.dataset.type)
        $.ajax({
            'url': `/api/sellToggle/${this.dataset.id}`,
            'type': 'GET',
            'success': function (result) {
                if (result.message == 1) {
                    $(`#sell-${result.purchaseId}`).addClass('bg-secondary')
                    $(`#sell-${result.purchaseId}`).removeClass('bg-success')
                    $(`#sell-${result.purchaseId}`).text('Sell')
                } else {
                    $(`#sell-${result.purchaseId}`).addClass('bg-success')
                    $(`#sell-${result.purchaseId}`).removeClass('bg-secondary')
                    $(`#sell-${result.purchaseId}`).text('Keep')


                }
            }
        });
    })
    $('.is-sold').on('click', function () {
        console.log(this.dataset.id, this.dataset.type)
        $.ajax({
            'url': `/api/soldToggle/${this.dataset.id}`,
            'type': 'GET',
            'success': function (result) {
                if (result.message == 1) {
                    $(`#sold-${result.purchaseId}`).addClass('bg-secondary')
                    $(`#sold-${result.purchaseId}`).removeClass('bg-success')
                    $(`#sold-${result.purchaseId}`).text('Sold')

                } else {
                    $(`#sold-${result.purchaseId}`).addClass('bg-success')
                    $(`#sold-${result.purchaseId}`).removeClass('bg-secondary')
                    $(`#sold-${result.purchaseId}`).text('Have')


                }
            }
        });
    })
    $('div#missing').hide()
    $('.editableField').on('blur', function (event) {
        event.preventDefault()
        $.ajax({
            url: `/api/update/${this.dataset.type}`,
            type: 'POST',
            data: {
                detail: $(this).text(),
                id: this.dataset.id
            },
            dataType: 'jsonp',
            success: function (result) {
                console.log($(this).text())
            }
        });
    })
    $('#toggle-box').change(function () {
        swap()
    })
})

function swap() {
    const trans = 500
    const allDiv = $('div#all').css('display')
    const missingDiv = $('div#missing').css('display')
    console.log(`swapping ${allDiv} and ${missingDiv}`)
    if (allDiv != "none") {
        $('div#all').hide(trans)
        $('div#missing').show(trans)
    } else {
        $('div#all').show(trans)
        $('div#missing').hide(trans)
    }
    if (missingDiv != "none") {
        $('div#missing').hide(trans)
        $('div#all').show(trans)

    } else {
        $('div#missing').show(trans)
        $('div#all').hide(trans)
    }
}

function picRefresh() {
    console.log('refreshing')
    $.ajax({
        'url': `/api/picRefresh`,
        'type': 'GET',
        'beforeSend': function () {
            $('#picRefresh').addClass('disabled');
        },
        'success': function (result) {

        },
        'complete': setTimeout(function () {
            console.log(`Successful refresh `)
            $('#picRefresh').removeClass('disabled')
        }, 20000)
    });
}