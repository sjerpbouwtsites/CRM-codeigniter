/* eslint-disable */
function convertPassphraseToKey(passphraseString) {
    var iterations = 1000000;   // Longer is slower... hence stronger
    var saltString = "You need to know the salt later to decrypt. It's not a secret, though.";
    var saltBytes = stringToByteArray(saltString);
    var passphraseBytes = stringToByteArray(passphraseString);

    return window.crypto.subtle.importKey(
        "raw", passphraseBytes, {name: "PBKDF2"}, false, ["deriveKey"]
    ).then(function(baseKey) {
        return window.crypto.subtle.deriveKey(
            {name: "PBKDF2", salt: saltBytes, iterations: iterations, hash: "SHA-1"},
            baseKey,
            {name: "AES-CBC", length: 256},
            false,
            ["encrypt", "decrypt"]
        );
    }).catch(function(err) {
        alert("Could not generate a key from passphrase '" + passphrase + "': " + err.message);
    });
}


function maakSleutelEnVersleutel (sleutelBasis) {
    communiceer('sleutel aanmaken begonnen');

    convertPassphraseToKey(sleutelBasis
    ).then(function(key) {

        var iv = window.crypto.getRandomValues(new Uint8Array(16));
        printIV.value = byteArrayToBase64(iv);

        communiceer('versleutelen begonnen');

        var $formPers = $("form [class|='pers']");

        $formPers.each(function(i, veld){

            var type = veld.getAttribute('data-naam');

            if (type ==='id') {
                return;
            }

            var ditIsDeLaatste = !(($formPers.length - 1) - i);

            var w = veld.value.trim();
            if (type === 'telefoon') {
                w = w.replace(/[^0-9]+|\s+/gmi, "");
            }

            var encryptieRes = window.crypto.subtle.encrypt(
                {name: "AES-CBC", iv: iv},
                key,
                stringToByteArray(veld.value)
            );

            encryptieRes.then(function(ciphertextBuf){
                var ciphertextBytes = new Uint8Array(ciphertextBuf);
                var base64Ciphertext = byteArrayToBase64(ciphertextBytes);
                veld.value = base64Ciphertext;

                if (ditIsDeLaatste) $(".opgepast.verzenden").show();

            }).catch(function(err){
                communiceer(err.message);
            });


           veld.setAttribute("oude-type",veld.getAttribute('type'));
           veld.setAttribute("type", "text");

            if (veld.hasAttribute('required')) {
               veld.removeAttribute('required');
               veld.setAttribute('oud-required', "true");
            }

        });

        communiceer('versleutelen klaar', 1000);

        $('form').addClass('versleuteld');

    }).catch(function(err){
        communiceer('versleutelen mislukt: '+ err.message);
    });
}

function maakSleutelEnOntsleutel (sleutel) {

    var ivBytes = base64ToByteArray(printIV.value);


    communiceer('decryptiesleutel wordt gemaakt');

    convertPassphraseToKey(sleutel
    ).then(function(aesKey) {

        communiceer('decryptie begint');

        var $formPers = $("form [class|='pers']");

        $formPers.each(function(i, veld){

            var type = veld.getAttribute('data-naam');

            if (type ==='id' || !veld.value.length) {
                return;
            }


            var ditIsDeLaatste = !(($formPers.length - 1) - i);

            var ciphertextBytes = base64ToByteArray(veld.value);

            window.crypto.subtle.decrypt(
                {name: "AES-CBC", iv: ivBytes}, aesKey, ciphertextBytes
            ).then(function(plaintextBuffer) {

                var nweTekst = byteArrayToString(plaintextBuffer);

                veld.setAttribute('value', nweTekst);
                veld.value = nweTekst;
                if (veld.getAttribute('data-naam') === 'ik_wil'
                    || veld.getAttribute('data-naam') === 'aantekening') {
                    veld.textContent = nweTekst;
                }

                veld.setAttribute("type", veld.getAttribute('oude-type'));

                if (veld.hasAttribute('oud-required')) {
                    veld.setAttribute('required', "true");
                }

                if (ditIsDeLaatste) {
                    initActies();
                }


            }).catch(function(err) {
                communiceer('ontcijferen mislukt: '+ err.message);
            });

        });

        communiceer('decryptie klaar', 1000);

    }).catch(function(err){
        communiceer(verwerkFout(err, true));
    });
}