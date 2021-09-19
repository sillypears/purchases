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
      $('.sculpt').on('click', function() {
          console.log(this.textContent)
      })
      $('.archivist').on('click', function() {
        console.log(this.textContent)
    })
    $('.editableField').on('blur', function(event){
        event.preventDefault()
        $.ajax({
            url: `/api/update/${this.dataset.type}`,
            type: 'POST', 
            data: {
                detail: $(this).text(),
                id: this.dataset.id
            },
            dataType: 'jsonp',
            success: function(result){
                console.log($(this).text())
            }
          });
    })
})  