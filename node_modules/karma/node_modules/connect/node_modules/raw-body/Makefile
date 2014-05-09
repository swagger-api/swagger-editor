NODE ?= node
BIN = ./node_modules/.bin/

test:
	@${NODE} ${BIN}mocha \
		--reporter spec \
		--bail \
		./test/index.js

clean:
	@rm -rf node_modules

.PHONY: test clean
