'use strict';

import mongoose from 'mongoose';
import settings from '../settings/init';
import initServer from './server';

function connectDB(fn){

  mongoose.connect(settings.get('db'), error => fn(error ? error : null));

}

export default function(options, done){

  connectDB(error => {

    if(error) return done(error);

    initServer(done);

  });

}
