#!/bin/bash

ADMIN_EMAIL="osmanakol@outlook.com"
ADMIN_PASSWORD=""
HOST="localhost"
PORT=27017
DB="nodejs-auth"

CURRENT_DIRECTORY="$(pwd)" # It has to be on main directory



function check_admin_role {
	result=$(mongo --host $HOST --port $PORT --quiet --eval "
	db=db.getSiblingDB('${DB}');
	db.roles.find({'roleName': 'admin'}).count();");

	if [ "$result" -gt 0 ]
	then
		echo "Admin role found"
	else
		echo "Admin role not found"
		create=$(mongo --host $HOST --port $PORT --quiet --eval "
		db=db.getSiblingDB('${DB}');
		db.roles.insert({'roleName': 'admin', 'isActive': true}).nInserted;")
		
		if [ "$create" -eq 1 ]
		then
			echo "Admin role is added"
		else
			echo "Admin role could not added"
			exit 1;
		fi
	fi
}

function add_admin_user {
	result=$(mongo --host $HOST --port $PORT --quiet --eval "
		db=db.getSiblingDB('${DB}');
		role_id=db.roles.findOne({'roleName': 'admin'})._id;
		check_admin=db.users.find({'roleId': role_id}).count();
		if (check_admin == 0){
			db.users.insert({'name_surname': 'Admin', 'email': '${ADMIN_EMAIL}', 'password': '123', 'roleId': role_id}).nInserted;
		};
	")

	if [ "$result" -eq 1 ]
	then
		echo "Admin user created"
	fi
}

function json_escape {
	export PYTHONIOENCODING=utf-8;
    cat < "$1" | python -c 'import json,sys; arr = json.load(sys.stdin, encoding="utf-8").values(); str_arr = [x.encode("utf8") for x in arr]; print(str_arr);'
}

function add_role_to_acl {
	echo "adding to access admin role for $1 module"
	result=$(mongo --host $HOST --port $PORT --quiet --eval "
		db=db.getSiblingDB('${DB}');
		role_id=db.roles.findOne({'roleName': 'admin'})._id;
		admin_id=db.users.find({'roleId': role_id})._id;
		acl_check=db.acl.find({'moduleName': $1})
		acl_check_with_role=db.acl.find({'moduleName': $1, 'aclSchema.roleId': role_id})
		if(!acl_check.count()){
			db.acl.insert({'moduleName': $1, 'aclSchema': [{'permission': {
					'GET': true,
					'POST': true,
					'PUT': true,
					'DELETE': true
				}, 'roleId': role_id}]
			});
		} else if(!acl_check_with_role.count()){
			db.acl.updateOne({'moduleName': $1},{\$push: {'aclSchema': {
				'permission': {
					'GET': true,
					'POST': true,
					'PUT': true,
					'DELETE': true
				}, 'roleId': role_id
			}}})
		}
		")
}

function get_modules {
 	modules=($(json_escape "$CURRENT_DIRECTORY/src/lib/acl/acl.module.conf.json" | tr -d '[],'))
	
	for module in "${modules[@]}"
	do
		add_role_to_acl "$module"
	done
}


check_admin_role
add_admin_user
get_modules

