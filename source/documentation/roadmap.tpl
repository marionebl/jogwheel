<%= props.partials.header('',  props.pkg.name + ' Roadmap') %>

> Alive and kicking

- [x] Basic project setup
- [x] Basic working and tested implementation
- [x] Speed up the Travis build process (max. 4 minutes)
- [x] Test min/max browser versions per default
- [ ] Use semantic-release for automatic npm releases
- [ ] Make integration tests workable with phantomjs
- [ ] Add `gh-pages` deployed automatically by Travis
- [ ] Add interactive playground with live code editing for examples
- [ ] Make all examples integration tests
- [ ] Unit test documentation examples
- [ ] Implement stubbed HTMLElement.prototype.style for React integration
- [ ] Implement (configurable) matchMedia callbacks to read responsive styles correctly

> Obsolute

- [ ] ~~Run browser tests only for code changes vs. documentation~~
- [ ] ~~Run full cross-browser tests for relase-builds~~

<%= props.partials.footer() %>
