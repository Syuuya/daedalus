with (import (fetchTarball https://github.com/NixOS/nixpkgs/archive/6a8790429692280998801c96660dcc85e30fb759.tar.gz) {});

stdenv.mkDerivation {
  name = "daedalus";

  buildInputs = [electron nodejs-6_x nodePackages_6_x.bower nodePackages_6_x.node-gyp nodePackages_6_x.node-pre-gyp ];

  src = null;

}
