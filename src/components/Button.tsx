import { Button as NativeButton, Heading, IButtonProps} from 'native-base';
import React from 'react';

type Props = IButtonProps & {
    title: string
}

export function Button( {title, ...rest}: Props ) {
  return (
    <NativeButton 
        bg="green.700"
        h={14}
        
        borderWidth={0}
        
        
        rounded="sm"
        _pressed={{bg: "gren.500"}}

        {...rest}
        >
            <Heading color="white" fontSize="sm" >
                {title}
            </Heading>
    </NativeButton >
  );
}