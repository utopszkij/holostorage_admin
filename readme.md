# admin layout for HOLOSTORAGE universal data storage layer

>status: pre-alpha not run correct!

## Features
- graphic UI for holostorage functions
- universal datamanager (browser, add, edit, delete, search)
- holostorage config manager

## Requests:
- holochain
- holostorage
- nodejs (only for test)
- can make bridge to holostorage for valid runing! see bridge_spec.json

## install

$ cd holochain_app_root

$ git clone https://github.com/utopszkij/holostorage_admin

## DNA test

$ ..../holostorage_admin/dna-test

$ hcdev test

## ui test - request nodejs

$ cd ...../holostorage_admin/ui-test

$ ./test.sh

## interactive test

cd ..../holostorage_admin

$ hcdev web 3142

In browser: http://yourdomain:3142

admin password for test: 123456

