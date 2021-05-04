APP_NAME="zanest"

#   By default (without ENVIRONMENT set) we run as "dev"
if [ -z "${ENVIRONMENT}" ]
then
	ENVIRONMENT="test"
fi


#
# RUN PRODUCTION
#
run_prd() {
  npm run prod
}

#
# RUN TESTS
#
run_test() {
  # Install dev dependencies
  npm i
  npm run test
}

#
# RUN LOCAL
#
run_local() {
  # Install dev dependencies
  npm i
  npm run dev
}

echo -ne "\n\n##\n##\tRUNNING WITH ENVIRONMENT=\"${ENVIRONMENT}\"\n##\n\n"
if [ "${ENVIRONMENT}" == "prd" ]
then
	run_prd
fi

if [ "${ENVIRONMENT}" == "test" ]
then
	run_test
fi

if [ "${ENVIRONMENT}" == "dev" ]
then
	run_local
fi
