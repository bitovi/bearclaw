module.exports = [
  {
    bomFormat: "CycloneDX",
    specVersion: "1.4",
    version: 1,
    metadata: {
      supplier: { name: "BigBear.ai" },
      authors: [{ name: "BEARCLAW" }],
      component: {
        type: "application",
        "bom-ref":
          "48fe3e4d5de5f76a0b5d5074f21b491d13a5faf86862d648aa5d499978f8da77",
        "mime-type": "application/x-executable",
        supplier: { name: "tp_link" },
        name: "tdpServer",
        components: [],
        properties: [
          {
            file: {
              fileinfo: {
                md5: "106dc09e20a382fd2fec750ba70ccb44",
                sha1: "8484a1efb88bed6a2ed9851d2e0b473c25d70cef",
                sha256:
                  "48fe3e4d5de5f76a0b5d5074f21b491d13a5faf86862d648aa5d499978f8da77",
              },
              filesize: 134064,
            },
          },
          { LIB_CVE_total: 0 },
          { Machine: "MIPS R3000" },
          { OS: "linux" },
          { Architecture: "mips" },
          { Bits: 32 },
          { GCC: "GCC_4.2.0" },
          { GCC: "GCC_3.0" },
        ],
      },
      tools: [
        { name: "BinAlyzer" },
        { name: "Strings" },
        { name: "CVEModule" },
      ],
    },
    components: [
      {
        "bom-ref":
          "48fe3e4d5de5f76a0b5d5074f21b491d13a5faf86862d648aa5d499978f8da77",
        name: "libuci.so",
        version: "0.0",
        type: "library",
      },
      {
        "bom-ref":
          "48fe3e4d5de5f76a0b5d5074f21b491d13a5faf86862d648aa5d499978f8da77",
        name: "libubus.so",
        version: "0.0",
        type: "library",
      },
      {
        "bom-ref":
          "48fe3e4d5de5f76a0b5d5074f21b491d13a5faf86862d648aa5d499978f8da77",
        name: "libubox.so",
        version: "0.0",
        type: "library",
      },
      {
        "bom-ref":
          "48fe3e4d5de5f76a0b5d5074f21b491d13a5faf86862d648aa5d499978f8da77",
        name: "libblobmsg_json.so",
        version: "0.0",
        type: "library",
      },
      {
        "bom-ref":
          "48fe3e4d5de5f76a0b5d5074f21b491d13a5faf86862d648aa5d499978f8da77",
        name: "libssl.so.1.0.0",
        version: "1.0.0",
        type: "library",
      },
      {
        "bom-ref":
          "48fe3e4d5de5f76a0b5d5074f21b491d13a5faf86862d648aa5d499978f8da77",
        name: "libcrypto.so.1.0.0",
        version: "1.0.0",
        type: "library",
      },
      {
        "bom-ref":
          "48fe3e4d5de5f76a0b5d5074f21b491d13a5faf86862d648aa5d499978f8da77",
        name: "libjson-c.so.2",
        version: "2.0",
        type: "library",
      },
      {
        "bom-ref":
          "48fe3e4d5de5f76a0b5d5074f21b491d13a5faf86862d648aa5d499978f8da77",
        name: "liblua.so.5.1.4",
        version: "5.1.4",
        type: "library",
      },
      {
        "bom-ref":
          "48fe3e4d5de5f76a0b5d5074f21b491d13a5faf86862d648aa5d499978f8da77",
        name: "libm.so.0",
        version: "0.0",
        type: "library",
      },
      {
        "bom-ref":
          "48fe3e4d5de5f76a0b5d5074f21b491d13a5faf86862d648aa5d499978f8da77",
        name: "libgcc_s.so.1",
        version: "1.0",
        type: "library",
      },
      {
        "bom-ref":
          "48fe3e4d5de5f76a0b5d5074f21b491d13a5faf86862d648aa5d499978f8da77",
        name: "libpthread.so.0",
        version: "0.0",
        type: "library",
      },
      {
        "bom-ref":
          "48fe3e4d5de5f76a0b5d5074f21b491d13a5faf86862d648aa5d499978f8da77",
        name: "libc.so.0",
        version: "0.0",
        type: "library",
      },
      {
        "bom-ref":
          "48fe3e4d5de5f76a0b5d5074f21b491d13a5faf86862d648aa5d499978f8da77",
        name: "ld-uclibc.so.0",
        version: "0.0",
        type: "library",
      },
      {
        "bom-ref":
          "48fe3e4d5de5f76a0b5d5074f21b491d13a5faf86862d648aa5d499978f8da77",
        name: "tdpSharedBuf.c",
        type: "file",
      },
    ],
    services: [],
    dependencies: [
      {
        ref: "48fe3e4d5de5f76a0b5d5074f21b491d13a5faf86862d648aa5d499978f8da77",
        dependsOn: [
          "libuci.so",
          "libubus.so",
          "libubox.so",
          "libblobmsg_json.so",
          "libssl.so.1.0.0",
          "libcrypto.so.1.0.0",
          "libjson-c.so.2",
          "liblua.so.5.1.4",
          "libm.so.0",
          "libgcc_s.so.1",
          "libpthread.so.0",
          "libc.so.0",
          "ld-uclibc.so.0",
        ],
      },
    ],
    vulnerabilities: [
      {
        properties: [
          {
            exploitability3: {
              attackcomplexity: "LOW",
              attackvector: "LOCAL",
              privilegesrequired: "LOW",
              scope: "UNCHANGED",
              userinteraction: "NONE",
            },
          },
          { exploitabilityScore3: 1.8 },
        ],
        id: "CVE-2022-41783",
        source: { name: "vultures@jpcert.or.jp" },
        description:
          "tdpServer of TP-Link RE300 V1 improperly processes its input, which may allow an attacker to cause a denial-of-service (DoS) condition of the products OneMesh function.",
        "bom-ref":
          "48fe3e4d5de5f76a0b5d5074f21b491d13a5faf86862d648aa5d499978f8da77",
      },
      {
        properties: [
          {
            exploitability3: {
              attackcomplexity: "LOW",
              attackvector: "NETWORK",
              privilegesrequired: "NONE",
              scope: "UNCHANGED",
              userinteraction: "NONE",
            },
          },
          { exploitabilityScore: 10.0 },
          { exploitabilityScore3: 3.9 },
        ],
        id: "CVE-2020-28347",
        source: { name: "cve@mitre.org" },
        description:
          "tdpServer on TP-Link Archer A7 AC1750 devices before 201029 allows remote attackers to execute arbitrary code via the slave_mac parameter. NOTE: this issue exists because of an incomplete fix for CVE-2020-10882 in which shell quotes are mishandled.",
        "bom-ref":
          "48fe3e4d5de5f76a0b5d5074f21b491d13a5faf86862d648aa5d499978f8da77",
      },
      {
        properties: [
          {
            exploitability3: {
              attackcomplexity: "LOW",
              attackvector: "ADJACENT_NETWORK",
              privilegesrequired: "NONE",
              scope: "UNCHANGED",
              userinteraction: "REQUIRED",
            },
          },
          { exploitabilityScore: 5.5 },
          { exploitabilityScore3: 2.1 },
        ],
        id: "CVE-2021-27246",
        source: { name: "zdi-disclosures@trendmicro.com" },
        description:
          "This vulnerability allows network-adjacent attackers to execute arbitrary code on affected installations of TP-Link Archer A7 AC1750 1.0.15 routers. Authentication is not required to exploit this vulnerability. The specific flaw exists within the handling of MAC addresses by the tdpServer endpoint. A crafted TCP message can write stack pointers to the stack. An attacker can leverage this vulnerability to execute code in the context of the root user. Was ZDI-CAN-12306.",
        "bom-ref":
          "48fe3e4d5de5f76a0b5d5074f21b491d13a5faf86862d648aa5d499978f8da77",
      },
      {
        properties: [
          {
            exploitability3: {
              attackcomplexity: "LOW",
              attackvector: "ADJACENT_NETWORK",
              privilegesrequired: "NONE",
              scope: "UNCHANGED",
              userinteraction: "NONE",
            },
          },
          { exploitabilityScore: 6.5 },
          { exploitabilityScore3: 2.8 },
        ],
        id: "CVE-2020-10882",
        source: { name: "zdi-disclosures@trendmicro.com" },
        description:
          "This vulnerability allows network-adjacent attackers to execute arbitrary code on affected installations of TP-Link Archer A7 Firmware Ver: 190726 AC1750 routers. Authentication is not required to exploit this vulnerability. The specific flaw exists within the tdpServer service, which listens on UDP port 20002 by default. When parsing the slave_mac parameter, the process does not properly validate a user-supplied string before using it to execute a system call. An attacker can leverage this vulnerability to execute code in the context of the root user. Was ZDI-CAN-9650.",
        "bom-ref":
          "48fe3e4d5de5f76a0b5d5074f21b491d13a5faf86862d648aa5d499978f8da77",
      },
      {
        properties: [
          {
            exploitability3: {
              attackcomplexity: "LOW",
              attackvector: "ADJACENT_NETWORK",
              privilegesrequired: "NONE",
              scope: "UNCHANGED",
              userinteraction: "NONE",
            },
          },
          { exploitabilityScore: 6.5 },
          { exploitabilityScore3: 2.8 },
        ],
        id: "CVE-2020-10884",
        source: { name: "zdi-disclosures@trendmicro.com" },
        description:
          "This vulnerability allows network-adjacent attackers execute arbitrary code on affected installations of TP-Link Archer A7 Firmware Ver: 190726 AC1750 routers. Authentication is not required to exploit this vulnerability. The specific flaw exists within the tdpServer service, which listens on UDP port 20002 by default. This issue results from the use of hard-coded encryption key. An attacker can leverage this in conjunction with other vulnerabilities to execute code in the context of root. Was ZDI-CAN-9652.",
        "bom-ref":
          "48fe3e4d5de5f76a0b5d5074f21b491d13a5faf86862d648aa5d499978f8da77",
      },
    ],
  },
];
