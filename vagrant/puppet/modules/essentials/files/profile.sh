#!/usr/bin/env bash

# UNIX relative functions/alias
alias cd1="cd .."
alias cd2="cd ../.."
alias cd3="cd ../../.."
alias cd4="cd ../../../.."
alias cd5="cd ../../../../.."

function mkcd () { mkdir -p "$@" && eval cd "\"\$$#\""; }
function la () { ls "$1" -lashr; }

shopt -s cdspell

# Environment variables
CDPATH=/var/www/kalzate
export CDPATH

# Project relative functions/alias
function run_server () { cd /var/www/kalzate && grunt; }
function run_build () { cd /var/www/kalzate && grunt; }
function run_test () { cd /var/www/kalzate && grunt; }

