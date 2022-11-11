$(function () {
    console.log('editing')

    $('.pls-delet').on('click', function () {
        console.log(this.dataset.id, this.dataset.type)
        $.ajax({
            'url': `/api/purchase/${this.dataset.id}/delete`,
            'type': 'POST',
            'success': function (result) {
                console.log(result)
                document.location = '/'
            }
        });
    })
})
