# Changelog

## [0.3.0](https://github.com/access-ci-org/access-ci-account/compare/v0.2.0...v0.3.0) (2026-04-15)


### Features

* suspend select components while options are loading ([2528262](https://github.com/access-ci-org/access-ci-account/commit/25282629bd232381c29bc7c15f3302cb5436cf59))


### Bug Fixes

* **multi-degree-field:** fix params type ([2e0c30f](https://github.com/access-ci-org/access-ci-account/commit/2e0c30fa42d561e37fc270b18d3a77368d01f230))
* **profile:** require a value in select fields ([a752ea4](https://github.com/access-ci-org/access-ci-account/commit/a752ea44bff868a0acc51228ffae7ff877714413))
* **verify:** fix detection of ineligible domains ([a307d43](https://github.com/access-ci-org/access-ci-account/commit/a307d43976838ae17f20074c395e6b4b9729e803))

## [0.2.0](https://github.com/access-ci-org/access-ci-account/compare/v0.1.2...v0.2.0) (2026-04-08)


### Features

* add ability for admins to impersonate ([06a9634](https://github.com/access-ci-org/access-ci-account/commit/06a96344277b597713ca3119eb2ea450c7e0b32c))


### Bug Fixes

* **menus:** close menu after impersonate click ([83e852d](https://github.com/access-ci-org/access-ci-account/commit/83e852d46172346c3fa65d589e5ed4da50ea3843))

## [0.1.2](https://github.com/access-ci-org/access-ci-account/compare/v0.1.1...v0.1.2) (2026-04-07)


### Bug Fixes

* correct base URL for development and staging ([302de03](https://github.com/access-ci-org/access-ci-account/commit/302de030bca98e76ed6e1a2abf95691325b14db1))
* remove TanStack dev tools ([a9549a5](https://github.com/access-ci-org/access-ci-account/commit/a9549a597167f8fe8ded04f1c411239ed3497e52))

## [0.1.1](https://github.com/access-ci-org/access-ci-account/compare/v0.1.0...v0.1.1) (2026-04-07)


### Bug Fixes

* only set base URL for development and staging ([a0a3749](https://github.com/access-ci-org/access-ci-account/commit/a0a374990eee69f75082975403121d0bef66b3c2))

## 0.1.0 (2026-04-07)


### Features

* add ACCESS base styles ([643a307](https://github.com/access-ci-org/access-ci-account/commit/643a3074966fdaf5b185a321b109c9b88f67efaf))
* add ACCESS header and footer ([54e17e6](https://github.com/access-ci-org/access-ci-account/commit/54e17e658daf031a4b939a53a871fc289f160157))
* add breadcrumbs ([a7a452c](https://github.com/access-ci-org/access-ci-account/commit/a7a452c67177ecbe793bd6fc1968575f7847f19c))
* add empty dashboard component ([13c8a94](https://github.com/access-ci-org/access-ci-account/commit/13c8a94e3a40ab49283b5fe4c0d8d3ea42a164cc))
* add header and footer components to React app ([3d54151](https://github.com/access-ci-org/access-ci-account/commit/3d541516a08cfd2238857674927698d982760711))
* add placeholder forms for completing registration and profile ([a487426](https://github.com/access-ci-org/access-ci-account/commit/a4874265f5f2504dd33c4e6ef7db072590855a6b))
* add support for registering with an existing identity ([530ed6b](https://github.com/access-ci-org/access-ci-account/commit/530ed6bb1f525a3939738276feea45d6e57e2e1a))
* add universal menus to React app ([35f6f06](https://github.com/access-ci-org/access-ci-account/commit/35f6f067173570631e5a32a5c06189e40764d9ef))
* allow multiple values for citizenship country ([4e430bf](https://github.com/access-ci-org/access-ci-account/commit/4e430bf436771eada83ff91de491821ced710972))
* **auth:** add login and auth-token routes ([8f19492](https://github.com/access-ci-org/access-ci-account/commit/8f19492065a41a77caec2d0fbea38682887cd762))
* **auth:** add logout route ([73bbdb0](https://github.com/access-ci-org/access-ci-account/commit/73bbdb0f684affc6d55286d0020998f01559f49c))
* **auth:** use CILogon tokens for login and link ([9f9bb21](https://github.com/access-ci-org/access-ci-account/commit/9f9bb211b0bda0ddbb121ccf13c38dddf97a1d79))
* generate application with create-tsrouter-app ([64a5099](https://github.com/access-ci-org/access-ci-account/commit/64a5099ffd4e32002a816992e333d68453489874))
* **home:** replace placeholder content with buttons ([29f8004](https://github.com/access-ci-org/access-ci-account/commit/29f80041ddc7055ccc05d205ce68a05fd8f50a1f))
* **profile:** get degree types from API ([f16088b](https://github.com/access-ci-org/access-ci-account/commit/f16088b14db623e243d86dfc19a1747b5c8e385c))
* **profile:** show account data in profile form ([7b6cacb](https://github.com/access-ci-org/access-ci-account/commit/7b6cacb306fb616989123417c91bb00bccd5a44c))
* **profile:** update profile on submit ([4ad6d36](https://github.com/access-ci-org/access-ci-account/commit/4ad6d367593585c079ea07c2a9d568ca83322905))
* reflect login state in menus ([3061718](https://github.com/access-ci-org/access-ci-account/commit/3061718f750575d7386f4dd7aad4bba5a8dc745d))
* **register:** add notification for existing accounts ([9b752a1](https://github.com/access-ci-org/access-ci-account/commit/9b752a19ed11361b11698d6674fb11ac050f1c25))
* **register:** add registration start form ([4a062fe](https://github.com/access-ci-org/access-ci-account/commit/4a062fe316edd2c82bdbb59c697e791f311aaac3))
* **register:** don't allow user to change email in registration form ([bfa46dc](https://github.com/access-ci-org/access-ci-account/commit/bfa46dc2cd6fb11209ddf9c6193ed70babcf4845))
* show dashboard at root URL for logged in users ([9dda9be](https://github.com/access-ci-org/access-ci-account/commit/9dda9beb89f10ca19a68dabae46edc3e09289ba7))
* **state:** add update account atom ([40de40e](https://github.com/access-ci-org/access-ci-account/commit/40de40edb9d72090d433bdf61b6ca5eb9fccc98f))
* **state:** add update account atom ([9523db7](https://github.com/access-ci-org/access-ci-account/commit/9523db772779611c6e1a953acac8753b6bc33fa5))
* **state:** connect /auth/send-otp route ([4742d92](https://github.com/access-ci-org/access-ci-account/commit/4742d92c089ce4a204a5c81ece3fa5b5eaeb03fb))
* **state:** connect /auth/verify-otp route ([860dbc7](https://github.com/access-ci-org/access-ci-account/commit/860dbc7eab2412e60968f77ae39f05b8f6b44deb))
* update home page links ([d3de569](https://github.com/access-ci-org/access-ci-account/commit/d3de569d8adf7377a73347cfb97b7ac808be8d07))
* update profile email verification for auth changes ([9361110](https://github.com/access-ci-org/access-ci-account/commit/936111090765d261ba052709cc5da51a840d7104))


### Bug Fixes

* add logout route to types ([9b94402](https://github.com/access-ci-org/access-ci-account/commit/9b944028f67fc15f11afa8fa8a7a322d8080668c))
* **auth-token:** use snake case for query string parameters ([19b08a0](https://github.com/access-ci-org/access-ci-account/commit/19b08a076b7e4d17b837bb8883fde92b7f16dc96))
* **breadcrumbs:** navigate using router ([cf478e5](https://github.com/access-ci-org/access-ci-account/commit/cf478e511537b88159b9b9196741017ac3144208))
* **card:** add default bottom margin ([53b8f70](https://github.com/access-ci-org/access-ci-account/commit/53b8f70905ac76d125bb4e00581b54d32001a77a))
* **checkbox:** set background color ([2a1e2f7](https://github.com/access-ci-org/access-ci-account/commit/2a1e2f752dd93021253e9ef6b64d6188fc430c49))
* **dashboard:** fix typos in help tickets box ([4db149b](https://github.com/access-ci-org/access-ci-account/commit/4db149bb08d05e680dca19c5e7c9b0865d0c24b1))
* **forms:** use numeric type for ID field values ([d047172](https://github.com/access-ci-org/access-ci-account/commit/d0471727087f5f2531b89867bee9bc040e0ea064))
* **menus:** use router navigation for login and logout ([7659d4e](https://github.com/access-ci-org/access-ci-account/commit/7659d4e6f611545a174a763b794c492c0882bfe3))
* move delete button submit logic into SSH key component ([10f086d](https://github.com/access-ci-org/access-ci-account/commit/10f086df83702b6c087b97723fa1ee0098b4bd6f))
* **profile:** allow removal of all degrees ([ffead9e](https://github.com/access-ci-org/access-ci-account/commit/ffead9e242c8b6232e312bc005e053688e7fd184))
* **profile:** fix degree field name and type ([e3160f5](https://github.com/access-ci-org/access-ci-account/commit/e3160f58b161e9dcebf8b6f58d3b00c97379d3fd))
* **profile:** fix key for academic status ([1835e44](https://github.com/access-ci-org/access-ci-account/commit/1835e44f15f32fa044e1753091624ca573a273ab))
* **profile:** fix profile form type error ([a2e8dda](https://github.com/access-ci-org/access-ci-account/commit/a2e8dda39bead14ee86e9b2b5096040c6bb320b0))
* **profile:** hide role field with CSS ([0bcfbe6](https://github.com/access-ci-org/access-ci-account/commit/0bcfbe67c2e8c9fe6403c8ba141dc632e2887d92))
* **profile:** show additional fields from account ([ad4b545](https://github.com/access-ci-org/access-ci-account/commit/ad4b545864faa2650eefc2b551fd8d31e223beed))
* **profile:** update email atom before load ([5cbdd4c](https://github.com/access-ci-org/access-ci-account/commit/5cbdd4c5ebb1884d7f6b24eb45512546c14db90d))
* **profile:** update time zone options to match registry ([6801ce4](https://github.com/access-ci-org/access-ci-account/commit/6801ce49960e185506fbbccd854895cf91b1f6cd))
* **registration:** prevent flash of form before auth redirect ([ebabab1](https://github.com/access-ci-org/access-ci-account/commit/ebabab118ce8d48d70c33000a9147a8e9f3ddd51))
* **registration:** refresh link token before creating account ([06ac964](https://github.com/access-ci-org/access-ci-account/commit/06ac964df5514bedeec9740d7b6be9b34cac0174))
* **registration:** update tokens for registration ([f606233](https://github.com/access-ci-org/access-ci-account/commit/f60623309168e1a72767f6c0f926a9826a9002fc))
* **ssh-keys:** update SSH key language ([b14d136](https://github.com/access-ci-org/access-ci-account/commit/b14d1364da215fc4f511155feee0a53f08522163))
* **state:** rename unused get parameter ([9dfdfe9](https://github.com/access-ci-org/access-ci-account/commit/9dfdfe99e9ed3f53872de8dbec8543117f7166a3))
* **state:** show API error message if available ([f5fd2db](https://github.com/access-ci-org/access-ci-account/commit/f5fd2dbea60caae10bcf3ba2ab14af59255200c1))
* **style:** make form styles more consistent ([e167e51](https://github.com/access-ci-org/access-ci-account/commit/e167e5115b354a27c672d02013d621f6d231d361))
* **text-field:** get field from form context ([8c2d798](https://github.com/access-ci-org/access-ci-account/commit/8c2d79814d06a391e069797f1306bb0bc53591b7))
* **validation:** fix typescript error ([90ee85d](https://github.com/access-ci-org/access-ci-account/commit/90ee85da70ebd7d121b081cbb3cfed003a6bfce8))


### Miscellaneous Chores

* release 0.1.0 ([b63c796](https://github.com/access-ci-org/access-ci-account/commit/b63c7968a4cd7d1574d456df09c46b206640512c))
