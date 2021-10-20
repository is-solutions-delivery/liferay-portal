#!/bin/bash

function check_usage {
	export CUSTOM_ELEMENT_NAME="hello-world"
}

function create_react_app {
	yarn create react-app ${1}

	cd ${1}

	#
	# Set up Yarn.
	#

	echo "SKIP_PREFLIGHT_CHECK=true" > ".env"

	#
	# Install dependencies.
	#

	yarn add @craco/craco sass
	yarn add -D sass-to-string

	#
	# Use CRACO.
	#

	sed -i 's/"build": "react-scripts build"/"build": "craco build"/g' package.json
	sed -i 's/"start": "react-scripts start"/"start": "craco start"/g' package.json
	sed -i 's/"test": "react-scripts test"/"test": "craco test"/g' package.json

	write_craco_config_js

	write_index_js

	mv -f src/App.css src/App.scss

	sed -i "/App.css/d" src/App.js

	write_gitignore

	sed -i "s|<div id=\"root\"></div>|<${CUSTOM_ELEMENT_NAME}></${CUSTOM_ELEMENT_NAME}>|g" public/index.html

	cd ..
}

function date {
	export LC_ALL=en_US.UTF-8
	export TZ=America/Los_Angeles

	if [ -z ${1+x} ] || [ -z ${2+x} ]
	then
		if [ "$(uname)" == "Darwin" ]
		then
			echo $(/bin/date)
		elif [ -e /bin/date ]
		then
			echo $(/bin/date --iso-8601=seconds)
		else
			echo $(/usr/bin/date --iso-8601=seconds)
		fi
	else
		if [ "$(uname)" == "Darwin" ]
		then
			echo $(/bin/date -juf "%a %b %e %T %Z %Y" "${1}" "${2}")
		elif [ -e /bin/date ]
		then
			echo $(/bin/date -d "${1}" "${2}")
		else
			echo $(/usr/bin/date -d "${1}" "${2}")
		fi
	fi
}

function get_temp_dir {
	local current_date=$(date)

	local timestamp=$(date "${current_date}" "+%Y%m%d%H%M%S")

	#echo temp-${timestamp}
	echo temp-20211011103438
}

function main {
	check_usage

	local temp_dir=$(get_temp_dir)

	create_react_app ${temp_dir}

	overlay_react_app ${temp_dir}
}

function overlay_react_app {
	if [ ! -e "remote-app" ]
	then
		mv ${temp_dir} remote-app

		return
	fi

	#
	# Copy custom files and merge package-ext.json.
	#
}

function write_craco_config_js {
	cat <<EOF > craco.config.js
const sassRegex = /\.(scss|sass)$/;
module.exports = {
	webpack: {
		configure: (webpackConfig, {env, paths}) => {
			webpackConfig.module.rules[1].oneOf.unshift({
				exclude: /node_modules/,
				test: sassRegex,
				use: [
					'sass-to-string',
					{
						loader: 'sass-loader',
						options: {
							sassOptions: {
								outputStyle: 'compressed',
							},
						},
					},
				],
			});
			return webpackConfig;
		},
	},
};
EOF
}

function write_gitignore {
	cat <<EOF > .gitignore
EOF
}

function write_index_js {
cat <<EOF > src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppStyle from './App.scss';
import App from './App';
class WebComponent extends HTMLElement {
	connectedCallback() {
		ReactDOM.render(
			<>
				<style type="text/css">{AppStyle}</style>
				<React.StrictMode>
					<App />
				</React.StrictMode>
			</>,
			this.shadowRoot
		);
	}
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
	}
}
if (!customElements.get('${CUSTOM_ELEMENT_NAME}')) {
	customElements.define('${CUSTOM_ELEMENT_NAME}', WebComponent);
}
EOF
}

main