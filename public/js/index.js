$(function(){

    $('.toggle-icon').on('click',function() {
        console.log(this.dataset.id)
        $.ajax({
            'url': `/api/receiveToggle/${this.dataset.id}`,
            'type': 'GET',
            'success': function(result){
                if (result.message == 1){
                    $(`#card-${result.purchaseId}`).addClass('green')
                    $(`#card-${result.purchaseId}`).removeClass('red')
                } else {
                    $(`#card-${result.purchaseId}`).addClass('red')
                    $(`#card-${result.purchaseId}`).removeClass('green')

                }
            }
          });
      })
})  