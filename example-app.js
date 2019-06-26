window.addEventListener('load', function() {
    let SDK = window.EverlyticPushSDK;
    SDK.init({
        hash:"cD1lMjliNjNmNC05M2JlLTQxY2ItYmQ3NC0wM2Q0MDUyNzMzOWU7aT1odHRwOi8vbG9jYWwuZXZlcmx5dGljLmNvbTtwdWJrPUJDdnFhcm9pZHAzRnJvOGd6TGxFeXF5aHFmc2JqZVhXWkI2Mm9LQlRFZDBlNXVNWkNrWFllTGVqNXBKeWtkQU81ck9ZM1Y4Zk1tWXNNQzVFLXg0NEtjTQ==",
        // autoSubscribe: true, // Commented out so that we have full control over the user's subscribe
    });

    let subscriptionButton = document.querySelector('#push-subscription-button');
    subscriptionButton.addEventListener('click', function() {
        changePushButtonState('computing');
        if (!window.localStorage.getItem('isPushEnabled')) {
            const email = document.querySelector('#push-subscription-email').value;

            if (isEmailValid(email)) {
                SDK.subscribe({"email" : email}).then(function(){
                    window.localStorage.setItem('isPushEnabled', 'yes');
                    changePushButtonState('enabled');
                });
            } else {
                SDK.subscribeAnonymous().then(function(){
                    window.localStorage.setItem('isPushEnabled', 'yes');
                    changePushButtonState('enabled');
                });
            }
        } else {
            SDK.unsubscribe().then(function(){
                window.localStorage.removeItem('isPushEnabled');
                changePushButtonState('disabled');
            });
        }
    });

    // Initialize the button
    if (window.localStorage.getItem('isPushEnabled')) {
        changePushButtonState('enabled');
    }

    /***************************************
     ********** Private Functions **********
     ***************************************/

    function isEmailValid(email) {
        let emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return email !== '' && emailRegex.test(email)
    }

    function changePushButtonState(state) {
        switch (state) {
            case 'enabled':
                subscriptionButton.disabled = false;
                subscriptionButton.textContent = 'Disable Push notifications';
                subscriptionButton.className = 'btn btn-outline-danger';
                break;
            case 'disabled':
                subscriptionButton.disabled = false;
                subscriptionButton.textContent = 'Enable Push notifications';
                subscriptionButton.className = 'btn btn-outline-success';
                break;
            case 'computing':
                subscriptionButton.disabled = true;
                subscriptionButton.textContent = 'Loading...';
                break;
            case 'incompatible':
                subscriptionButton.disabled = true;
                subscriptionButton.textContent = 'Push notifications are not compatible with this browser';
                subscriptionButton.className = 'btn btn-danger';
                break;
            default:
                console.error('Unhandled push button state', state);
                break;
        }
    }
});