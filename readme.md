# admin layout for HOLOSTORAGE universal data storage layer

>status: pre-alpha ** not run correct! **

I think this concept is wrong. Holochain DHT validation in this construct can not be achieved. :( :( :(

## Features
- graphic UI for holostorage functions
- universal datamanager (browser, add, edit, delete, search)
- holostorage config manager

## Requests
- holochain
- holostorage
- nodejs (only for test)
- can make bridge to holostorage for valid runing! see bridge_spec.json

## Install

$ cd <holochain_app_root>

$ git clone https://github.com/utopszkij/holostorage_admin

## DNA test

$ <holochain_app_root>/holostorage_admin/dna-test

$ hcdev test

## UI test - request nodejs

$ cd <holochain_app_root>/holostorage_admin/ui-test

$ ./test.sh

## Interactive test

cd <holochain_app_root>/holostorage_admin

$ hcdev web 3142

In web browser: http://<yourdomain>:3142

admin password for test: 123456

