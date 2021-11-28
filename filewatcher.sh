inotifywait -m ./**/* -e modify |
    while read path action file;
        do
            echo "$path$file was changed";
            tijdnu=$(date +"%T")
            wslview http://localhost/crm?tabtime=$tijdnu#herladen-met-wachtwoord
        done

inotifywait -m ./js/**/* -e modify |
    while read path action file;
        do
            echo "$path$file was changed";
            tijdnu=$(date +"%T")
            wslview http://localhost/crm?tabtime=$tijdnu#herladen-met-wachtwoord
        done

inotifywait -m ./js/modules/**/* -e modify |
    while read path action file;
        do
            echo "$path$file was changed";
            tijdnu=$(date +"%T")
            wslview http://localhost/crm?tabtime=$tijdnu#herladen-met-wachtwoord
        done

inotifywait -m ./js/modules/panelen/**/* -e modify |
    while read path action file;
        do
            echo "$path$file was changed";
            tijdnu=$(date +"%T")
            wslview http://localhost/crm?tabtime=$tijdnu#herladen-met-wachtwoord
        done

inotifywait -m ./css -e create |
    while read path action file;
        do
            echo "$path$file was created"
        done        

inotifywait -m ./css -e delete |
    while read path action file;
        do
            echo "$path$file was delete"
        done                